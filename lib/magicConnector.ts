import type { ExternalProvider } from "@ethersproject/providers";
import { initializeConnector } from "@web3-react/core";
import type { Actions } from "@web3-react/types";
import { Connector } from "@web3-react/types";
import type {
  LoginWithMagicLinkConfiguration,
  Magic as MagicInstance,
  MagicSDKAdditionalConfiguration,
} from "magic-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { Eip1193Bridge } from "@ethersproject/experimental";
import { Magic } from "magic-sdk";

const chainIdToNetwork: {
  [key in number]: { rpcUrl: string; chainId: number };
} = {
  80001: {
    rpcUrl: "https://rpc-mumbai.maticvigil.com/", // Polygon RPC URL
    chainId: 80001, // Polygon chain id
  },
  137: {
    rpcUrl: "https://rpc-mainnet.maticvigil.com/", // Polygon RPC URL
    chainId: 137, // Polygon chain id
  },
};
export class MagicConnector extends Connector {
  private readonly options: MagicConnectorArguments;
  public magic?: MagicInstance;

  constructor(actions: Actions, options: MagicConnectorArguments) {
    super(actions);
    this.options = options;
  }

  private async startListening(
    configuration: LoginWithMagicLinkConfiguration
  ): Promise<string | null> {
    const { apiKey, ...options } = this.options;

    this.magic = new Magic(apiKey, options);
    let token: string | null = "";
    try {
      token = await this.magic.auth.loginWithMagicLink(configuration);
    } catch (e) {
      console.error(e);
    }

    const provider = new Web3Provider(
      this.magic.rpcProvider as unknown as ExternalProvider
    );

    this.provider = new Eip1193Bridge(provider.getSigner(), provider);
    return token;
  }

  /** @ts-ignore */
  public async activate(
    configuration: LoginWithMagicLinkConfiguration
  ): Promise<string | void | null> {
    this.actions.startActivation();

    const token = await this.startListening(configuration).catch(
      (error: Error) => {
        this.actions.reportError(error);
      }
    );

    if (this.provider) {
      await Promise.all([
        this.provider.request({ method: "eth_chainId" }) as Promise<string>,
        this.provider.request({ method: "eth_accounts" }) as Promise<string[]>,
      ])
        .then(([chainId, accounts]) => {
          this.actions.update({
            chainId: Number.parseInt(chainId, 16),
            accounts,
          });
        })
        .catch((error: Error) => {
          this.actions.reportError(error);
        });
    }
    return token;
  }
}

// making magic easier for us to use with web3-react
/** @ts-ignore */
export const magicConnector = initializeConnector<MagicConnector>(
  (actions) => {
    return new MagicConnector(actions, {
      apiKey: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!,
      // testMode: process.env.NODE_ENV !== "production",
      network: chainIdToNetwork[parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!)],
    });
  },
  [parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!)]
);

export interface MagicConnectorArguments
  extends MagicSDKAdditionalConfiguration {
  apiKey: string;
}
