import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    injected(),           // MetaMask, Rabby, and any injected wallet
    walletConnect({ projectId }),  // WalletConnect QR code
  ],
  // cookieStorage replaces indexedDB on the server — eliminates the SSR error
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC ?? "https://base-sepolia.drpc.org"
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC ?? "https://base.drpc.org"
    ),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
