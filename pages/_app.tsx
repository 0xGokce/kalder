import Layout from "@/components/Shared/Layout";
import "@/styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { useState } from "react";

const createApolloClient = (authToken: string) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://hasura.io/learn/graphql",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }),
    cache: new InMemoryCache(),
  });
};

function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [client] = useState(
    createApolloClient(process.env.HASURA_ADMIN_SECRET!)
  );
  return (
    <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ReactProvider>
    </ApolloProvider>
  );
}
