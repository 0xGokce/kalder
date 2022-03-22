/**
 * Note: This file is pretty much taken directly from web3-react, but has some modifications.
 * 1. Replaces the chainId and networks with matic-compatible networks
 */

const chainIdToNetwork: {
  [network: number]:
    | NetworkName
    | {
        rpcUrl: string;
        chainId: number;
      };
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

import { AbstractConnector } from "@web3-react/abstract-connector";
import { ConnectorUpdate } from "@web3-react/types";
import { Magic } from "magic-sdk";
import invariant from "tiny-invariant";

type NetworkName = "mainnet" | "ropsten" | "rinkeby" | "kovan";

interface MagicConnectorArguments {
  apiKey: string;
  chainId: number;
  email: string;
}

export const magicConnector = (email: string) =>
  new MagicConnector({
    apiKey: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!,
    // testMode: process.env.NODE_ENV !== "production",
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
    email,
  });

class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The user rejected the request.";
  }
}

class FailedVerificationError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The email verification failed.";
  }
}

class MagicLinkRateLimitError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The Magic rate limit has been reached.";
  }
}

class MagicLinkExpiredError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The Magic link has expired.";
  }
}

class MagicConnector extends AbstractConnector {
  private readonly apiKey: string;
  private readonly chainId: number;
  private readonly email: string;

  public magic!: Magic;

  constructor({ apiKey, chainId, email }: MagicConnectorArguments) {
    invariant(
      Object.keys(chainIdToNetwork).includes(chainId.toString()),
      `Unsupported chainId ${chainId}`
    );
    invariant(email && email.includes("@"), `Invalid email: ${email}`);
    super({ supportedChainIds: [chainId] });

    this.apiKey = apiKey;
    this.chainId = chainId;
    this.email = email;
  }

  public async activate(): Promise<ConnectorUpdate> {
    const MagicSDK = await import("magic-sdk").then((m) => m?.default ?? m);
    const { Magic, RPCError, RPCErrorCode } = MagicSDK;

    if (!this.magic) {
      this.magic = new Magic(this.apiKey, {
        network: chainIdToNetwork[this.chainId],
      });
    }

    const isLoggedIn = await this.magic.user.isLoggedIn();
    const loggedInEmail = isLoggedIn
      ? (await this.magic.user.getMetadata()).email
      : null;

    if (isLoggedIn && loggedInEmail !== this.email) {
      await this.magic.user.logout();
    }

    if (!isLoggedIn) {
      try {
        const token = await this.magic.auth.loginWithMagicLink({
          email: this.email,
        });
      } catch (err) {
        if (!(err instanceof RPCError)) {
          throw err;
        }
        if (err.code === RPCErrorCode.MagicLinkFailedVerification) {
          throw new FailedVerificationError();
        }
        if (err.code === RPCErrorCode.MagicLinkExpired) {
          throw new MagicLinkExpiredError();
        }
        if (err.code === RPCErrorCode.MagicLinkRateLimited) {
          throw new MagicLinkRateLimitError();
        }
        // This error gets thrown when users close the login window.
        // -32603 = JSON-RPC InternalError
        if (err.code === -32603) {
          throw new UserRejectedRequestError();
        }
      }
    }

    const provider = this.magic.rpcProvider;
    const account = await provider
      .enable()
      .then((accounts: string[]): string => accounts[0]);

    return { provider, chainId: this.chainId, account };
  }

  public async getProvider(): Promise<any> {
    return this.magic.rpcProvider;
  }

  public async getChainId(): Promise<number | string> {
    return this.chainId;
  }

  public async getAccount(): Promise<null | string> {
    return this.magic.rpcProvider
      .send("eth_accounts")
      .then((accounts: string[]): string => accounts[0]);
  }

  public deactivate() {}

  public async close() {
    await this.magic.user.logout();
    this.emitDeactivate();
  }
}
