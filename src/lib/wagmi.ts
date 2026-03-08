import { http } from 'wagmi'
import { base, mainnet, arbitrum } from 'viem/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = import.meta.env.VITE_WC_PROJECT_ID || 'dummy_project_id'

export const config = getDefaultConfig({
  appName: 'Bloomora',
  projectId,
  chains: [base, mainnet, arbitrum],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
