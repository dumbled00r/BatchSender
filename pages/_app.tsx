import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  ancient8,
  base,
  kroma,
  scroll,
  sepolia,
  optimism
} from 'wagmi/chains';
import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    {
      ...ancient8,
      iconBackground: '#FFD700',
      iconUrl:"https://pbs.twimg.com/profile_images/1701848315997077504/yovD2pCX_400x400.jpg"
      
    }, 
    base,
    optimism,
    {...scroll,
      iconBackground: '#FFD700',
      iconUrl:"https://pbs.twimg.com/profile_images/1696531511519150080/Fq5O0LeN_400x400.jpg"
    },
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <WagmiProvider  config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
