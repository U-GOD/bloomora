---
name: bloomora-architecture
description: >-
  ALWAYS use this skill when working on the Bloomora project structure, component organization,
  state management, or routing. Covers folder structure conventions, naming patterns, Zustand
  store patterns, React component hierarchy, and page routing for the Living Yield Garden app.
author: bloomora-team
---

# Bloomora Architecture — Project Conventions

## Folder Structure

```
src/
├── main.tsx                 # Entry point, mounts AppProviders + App
├── App.tsx                  # Router setup (react-router-dom)
├── index.css                # Global styles, Tailwind directives, design tokens
├── lib/                     # Pure utility modules (no React)
│   ├── wagmi.ts             # wagmi config: Base (8453), Ethereum (1), Arbitrum (42161)
│   ├── constants.ts         # Vault addresses, garden mappings, chain configs
│   └── utils.ts             # formatAmount, shortenAddress, etc.
├── providers/
│   └── AppProviders.tsx     # WagmiProvider > QueryClientProvider > RainbowKitProvider > YieldProvider
├── stores/
│   └── gardenStore.ts       # Zustand store: plants[], weather, gardenScore, events
├── hooks/                   # Custom React hooks
│   ├── useGardenSync.ts     # Polls YO vault data → updates gardenStore
│   ├── useSoundEffects.ts   # Plays audio on garden events
│   └── useAIGardener.ts     # Fetches AI rebalance suggestions
├── garden/                  # Canvas rendering engine (no React components here)
│   ├── PlantDNA.ts          # PlantDNA interface, growth algorithm, mutation thresholds
│   ├── GardenCanvas.tsx     # React wrapper for <canvas>, handles resize/RAF loop
│   ├── GardenRenderer.ts    # Core draw loop: sky, ground, plants, weather, particles
│   ├── PlantRenderer.ts     # Species-specific rendering (lavender, oak, vine, tulip, sunflower)
│   ├── WeatherSystem.ts     # Weather state machine + particle effects
│   └── ParticleSystem.ts    # Sparkles, rain drops, harvest confetti, pollen
├── components/
│   ├── layout/              # App shell: Header, BottomNav, PageTransition
│   ├── garden/              # Garden UI overlays: GardenView, PlantInfo, YieldTicker
│   ├── vault/               # DeFi UI: VaultCard, DepositFlow, RedeemFlow, RiskBadge
│   ├── ai/                  # AI Gardener: GardenerPanel, RebalanceSuggestion
│   ├── nft/                 # NFT minting: MintGarden
│   └── shared/              # Reusable: ConnectWallet, TransactionToast, RiskDisclosure
├── services/
│   ├── aiGardener.ts        # Off-chain suggestion engine (rule-based)
│   └── gardenNFT.ts         # Contract interaction helpers for BloomoraGarden.sol
└── pages/                   # Route-level components (thin wrappers)
    ├── Landing.tsx           # / — hero + connect wallet
    ├── Garden.tsx            # /garden — main canvas garden view
    ├── Plant.tsx             # /plant — deposit wizard
    ├── Harvest.tsx           # /harvest — redeem flow
    ├── Greenhouse.tsx        # /greenhouse — vault dashboard
    ├── Gardener.tsx          # /gardener — AI suggestions
    └── NFT.tsx               # /nft — mint garden NFT
```

## Component Naming

- **Pages**: PascalCase, match route name → `Garden.tsx` for `/garden`
- **Components**: PascalCase, descriptive → `VaultCard.tsx`, `DepositFlow.tsx`
- **Hooks**: camelCase, `use` prefix → `useGardenSync.ts`
- **Stores**: camelCase, `Store` suffix → `gardenStore.ts`
- **Services**: camelCase → `aiGardener.ts`
- **Garden engine**: PascalCase for classes/types, camelCase for functions

## State Management (Zustand)

```typescript
// gardenStore.ts pattern
import { create } from 'zustand'

interface GardenStore {
  plants: PlantDNA[]
  weather: WeatherState
  gardenScore: number
  
  // Actions
  addPlant: (plant: PlantDNA) => void
  updatePlantGrowth: (vaultAddress: string, apy: number) => void
  setWeather: (weather: WeatherState) => void
  triggerGrowthEvent: (vaultName: string, amount: string, txHash: string) => void
  triggerHarvestAnimation: (vaultName: string, txHash: string) => void
}
```

## Provider Nesting Order (CRITICAL)

```tsx
<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider>
      <YieldProvider defaultSlippageBps={100}>
        <Router>
          <App />
        </Router>
      </YieldProvider>
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

YieldProvider MUST be inside WagmiProvider and QueryClientProvider.

## Import Conventions

- Use `@/` alias for `src/` (configured in vite.config.ts + tsconfig.json)
- Group imports: React → third-party → @yo-protocol → local → types
- Use named exports, not default exports (except pages)
