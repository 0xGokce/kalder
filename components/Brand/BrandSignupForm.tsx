import { magicConnector } from "@/lib/magicConnector";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useLogin } from "hooks/useLogin";
import { FormEvent, useCallback } from "react";

export function BrandSignupForm() {
  const { activate } = useWeb3React<ethers.providers.Web3Provider>();
  const { loginWithMagic } = useLogin();
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
                  Brand Name
                </label>
                <div className="mt-1">
                  <input
                    id="brandname"
                    name="text"
                    type="company"
                    autoComplete="company"
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
                  Your Name
                </label>
                <div className="mt-1">
                  <input
                    id="yourname"
                    name="text"
                    type="given-name"
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
