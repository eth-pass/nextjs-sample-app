import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

import { chain, createClient, WagmiProvider, configureChains } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { DownloadModalProvider } from "../contexts/downloadModal";
import { Toaster } from "react-hot-toast";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "ethpass demo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  persister: null,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <DownloadModalProvider>
          <Component {...pageProps} />
          <Toaster />
        </DownloadModalProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default MyApp;
