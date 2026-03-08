import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { YieldProvider } from '@yo-protocol/react'
import { config } from '@/lib/wagmi'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s — vault data doesn't change that fast
      refetchInterval: 60_000, // Poll every 60s for yield updates
    },
  },
})

/**
 * AppProviders — Wraps the entire app with Web3 + YO Protocol context.
 *
 * Nesting order is critical:
 * WagmiProvider > QueryClientProvider > RainbowKitProvider > YieldProvider
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#6EE7B7',
            accentColorForeground: '#0A0F1C',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          <YieldProvider
            defaultSlippageBps={100} // 1% default slippage
            onError={(err) => console.error('[Bloomora YO Error]:', err)}
          >
            {children}
          </YieldProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
