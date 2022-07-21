export type BundlrNetwork = "node1" | "node2" | "devnet";

interface StorageManagerConfig {
  network: BundlrNetwork;
  currency: string;
  providerUrl?: string;
  walletPath: string;
}

const config: StorageManagerConfig = {
  network: "devnet",
  currency: "solana",
  providerUrl: "https://api.devnet.solana.com",
  walletPath: "devnet-wallet.json",
};

export default config;
