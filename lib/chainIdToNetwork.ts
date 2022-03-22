type Network = {
  chainId: string; // hex
  chainName: string;
  rpcUrls: string[];
  iconUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
};

/** For use in switching chains in Metamask */
export const chainIdToNetwork: { [key in number]: Network } = {
  [137]: {
    chainId: "0x" + 137?.toString(16),
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
    iconUrls: [],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  [80001]: {
    chainId: "0x" + 80001?.toString(16),
    chainName: "Mumbai",
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    iconUrls: [],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};
