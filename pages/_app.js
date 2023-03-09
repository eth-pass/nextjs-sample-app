import React, { useMemo } from "react";

// evm
import { chain, createClient, WagmiProvider, configureChains } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// solana
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// misc
import { DownloadModalProvider } from "contexts/downloadModal";
import { Toaster } from "react-hot-toast";

// css
import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "styles/globals.css";

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

const App = ({ Component, pageProps }) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new GlowWalletAdapter()],
    [network]
  );

  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ConnectionProvider endpoint={endpoint}>
          <DownloadModalProvider>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <Component {...pageProps} />
                <Toaster />
              </WalletModalProvider>
            </WalletProvider>
          </DownloadModalProvider>
        </ConnectionProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

export default App;
