import { chainIdToNetwork } from "@/lib/chainIdToNetwork";
import { injected } from "@/lib/injectedConnector";
import { magicConnector } from "@/lib/magicConnector";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useLogin } from "hooks/useLogin";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { MESSAGE_TO_SIGN } from "utils/constants";

export function CustomerSignupForm() {
  const requiredChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!);
  const {
    activate,
    account,
    library,
    chainId: currentChainId,
  } = useWeb3React<ethers.providers.Web3Provider>();

  const { loginWithMagic } = useLogin();
  const [{ signature }, setSignature] = useCookies(["signature"]);

  const onboarding = useRef<MetaMaskOnboarding>();

  /**
   * When account is loaded (metamask active, correct network, request a signature to prove ownership).
   * Once the signature is made, store it as a cookie.
   * */

  useEffect(() => {
    if (signature) {
      // we already have a signature, no need to sign a new one.
      return;
    }
    if (!library || !account) {
      // we can't sign anything without an account!
      return;
    }
    if (currentChainId !== requiredChainId) {
      // first thing to send them is request to switch chains. Don't overwhelm them.
      return;
    }
    const signer = library?.getSigner();
    if (!signer) {
      // we can't sign anything without a signer!
      console.error("Ready to sign but invalid signer");
      return;
    }

    signer.signMessage(MESSAGE_TO_SIGN).then((sig) => {
      setSignature("signature", sig);
    });
  }, [signature, currentChainId, requiredChainId, library, account]);

  /**
   * Activate Magic Connector
   */
  const onSignup = useCallback(
    async (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const email = evt.currentTarget.email.value;
      await loginWithMagic(email);
    },
    [activate]
  );

  const switchNetwork = useCallback(async () => {
    if (requiredChainId === currentChainId) return;

    const network = chainIdToNetwork[requiredChainId!];
    console.log(network, requiredChainId);
    /** Add the ethereum chain if it does not exist */
    /** @ts-ignore */
    await window?.ethereum?.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...network,
        },
      ],
    });

    /** Switch to the added ethereum chain */
    /** @ts-ignore */
    return window?.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainId }], // chainId must be in hexadecimal numbers
    });
  }, [library, requiredChainId, currentChainId]);

  /**
   * Activate Metamask Connector
   */
  const handleMetamask = useCallback(async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      await switchNetwork();
      await activate(injected, (error) => {
        console.error(error);
      });
    } else {
      onboarding?.current?.startOnboarding();
    }
  }, [activate, requiredChainId, currentChainId]);

  /**
   * Initialize the metamask onboarding
   */
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="mt-8">
          <div className="mt-6">
            <form onSubmit={onSignup} className="space-y-6">
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-primary"
                >
                  Your Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="text"
                    type="name"
                    autoComplete="name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primary"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              {account ? (
                <div>{account}</div>
              ) : (
                <button
                  type="button"
                  onClick={handleMetamask}
                  className="cursor-pointer hover:bg-primary text-primary hover:text-white flex flex-row items-center justify-items-stretch  py-2 px-4 md:m-4 my-2 rounded w-full"
                >
                  <img
                    src="/MetamaskLogo.svg"
                    width={100}
                    className="pr-2"
                  ></img>
                  <div className="flex flex-col">
                    <p className="text-xl ">Log in with Metamask</p>
                    <p className="text-sm  w-2/3 mx-auto">
                      This is a totally optional step. If you already have a
                      wallet, link it now.
                    </p>
                  </div>
                </button>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
