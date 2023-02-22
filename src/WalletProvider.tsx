import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, arbitrum, arbitrumGoerli } from "wagmi/dist/chains";
import { publicProvider } from "wagmi/dist/providers/public";
import { InjectedConnector } from "wagmi/dist/connectors/injected";

interface IProps {
  children: React.ReactNode;
}

const { chains, provider } = configureChains(
  [mainnet, goerli, arbitrum, arbitrumGoerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Wallet Migration",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [...connectors(), new InjectedConnector({ chains })],
  provider
});

export default function WalletProvider({ children }: IProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
