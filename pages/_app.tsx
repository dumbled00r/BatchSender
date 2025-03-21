import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import {
    mainnet,
    ancient8,
    base,
    arbitrum,
    scroll,
    sepolia,
    optimism,
    blast,
    opBNB,
    taiko,
    plumeTestnet,
    cyber
} from 'wagmi/chains'
import {
    darkTheme,
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { defineChain } from 'viem'

export const alienXTestnet = /*#__PURE__*/ defineChain({
    id: 10241025,
    name: 'AlienX Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://hal-rpc.alienxchain.io/http'] },
    },
    blockExplorers: {
        default: {
            name: 'Halscan',
            url: 'https://hal-explorer.alienxchain.io',
            apiUrl: 'https://hal.explorer.caldera.xyz/api/v2',
        },
    },
    testnet: true,
})

const config = getDefaultConfig({
    appName: 'RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [
        {
            ...ancient8,
            iconBackground: '#FFD700',
            iconUrl:
                'https://pbs.twimg.com/profile_images/1701848315997077504/yovD2pCX_400x400.jpg',
        },
        arbitrum,
        base,
        blast,
        plumeTestnet,
        opBNB,
        optimism,
        {
            ...scroll,
            iconBackground: '#FFD700',
            iconUrl:
                'https://pbs.twimg.com/profile_images/1696531511519150080/Fq5O0LeN_400x400.jpg',
        },
        taiko,
        mainnet,
        cyber,
        sepolia,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
            ? [sepolia]
            : []),
        {
            ...alienXTestnet,
            iconBackground: '#FFD700',
            iconUrl:
                'https://pbs.twimg.com/profile_images/1766021625194201088/uZ979d7D_400x400.jpg',
        },
    ],
    ssr: true,
})

const client = new QueryClient()

function MyApp({ Component, pageProps, router }: AppProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
                <RainbowKitProvider>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default MyApp
