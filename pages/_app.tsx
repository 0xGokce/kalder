import Layout from "@/components/Shared/Layout";
import "@/styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import type { AppProps } from "next/app";

function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
  );
}
