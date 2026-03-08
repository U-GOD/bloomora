# Bloomora

**The Living Yield Garden** -- A consumer DeFi savings app that transforms real vault deposits into a living, evolving digital garden.

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat-square&logo=coinbase)](https://base.org)
[![YO Protocol](https://img.shields.io/badge/Powered%20by-YO%20Protocol-6EE7B7?style=flat-square)](https://yo.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

---

## Overview

Bloomora turns passive DeFi savings into a daily visual habit. Users connect their wallet, deposit real assets into YO Protocol vaults (yoUSD, yoETH, yoBTC, yoEUR, yoGOLD), and watch a procedurally generated garden grow in real time. Stable vaults grow calm lavender bushes, volatile vaults sprout fast-climbing golden vines, and yield accrual makes plants visibly bloom. An AI Gardener monitors performance and suggests one-tap rebalances. Users can mint their evolved garden as an on-chain NFT.

No fake data. No mock deposits. Every interaction touches live ERC-4626 vaults on Base, Ethereum, and Arbitrum.

---

## Features

### Core DeFi
- **Real Vault Deposits** -- Deposit USDC, WETH, cbBTC, EURC, or XAUt into YO Protocol's ERC-4626 vaults via the official SDK
- **One-Tap Redeem** -- Harvest (redeem) your vault shares back to underlying assets at any time
- **Async Redemption Handling** -- Clear pending state UI for vaults that require settlement periods
- **Multi-Chain Support** -- Operates on Base (primary), Ethereum, and Arbitrum
- **Live Yield Tracking** -- Real-time APY, TVL, share price, and user P&L from the YO API

### Procedural Garden Engine
- **Plant DNA System** -- Each deposit generates a unique plant with genetics derived from vault type, deposit amount, APY, and risk level
- **Canvas 2D Renderer** -- Lightweight, mobile-optimized 60fps garden rendering using HTML5 Canvas
- **Growth Animation** -- Plants visibly grow based on real yield accrual with sigmoid-curve natural growth
- **Weather System** -- Risk signals manifest as weather events: sunshine for stable yields, rain for volatility, storms for high risk
- **Mutation System** -- Plants unlock visual traits at maturity thresholds (first bloom, full canopy, fruit bearing, legendary glow)

### Vault-to-Plant Mapping

| Vault  | Plant Species | Behavior |
|--------|--------------|----------|
| yoUSD  | Lavender Bush | Slow, steady growth with calm purple flowers |
| yoETH  | Oak Tree | Medium growth with spreading canopy branches |
| yoBTC  | Golden Vine | Fast, unpredictable climbing vine with gold leaves |
| yoEUR  | Tulip Garden | Orderly rows of blooming tulips |
| yoGOLD | Sunflower | Tall stem tracking the sun position |

### AI Gardener
- **Yield Analysis** -- Off-chain service monitors APY trends, TVL shifts, and portfolio balance
- **Smart Recommendations** -- Suggests rebalances when vault APY drops significantly or better alternatives emerge
- **One-Tap Execution** -- Execute suggested rebalances directly through the YO SDK with a single click
- **Transparent Reasoning** -- Every suggestion includes confidence scores and human-readable explanations

### Garden NFT
- **ERC-721 On-Chain** -- Mint your evolved garden as a permanent on-chain NFT on Base
- **Evolving Metadata** -- Garden NFT metadata updates as your portfolio grows and plants evolve
- **On-Chain History** -- All deposits, harvests, and garden evolution events are logged on-chain

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 |
| Web3 | wagmi v2, viem, TanStack Query v5 |
| Wallet | RainbowKit v2 |
| YO SDK | `@yo-protocol/core`, `@yo-protocol/react` |
| Garden Engine | HTML5 Canvas 2D |
| State Management | Zustand |
| Animations | Framer Motion |
| Smart Contracts | Solidity 0.8.25, Foundry |
| Contract Standards | ERC-721 (OpenZeppelin) |
| Deployment | Vercel (frontend), Base mainnet (contracts) |

---

## Project Structure

```
bloomora/
├── contracts/               # Foundry smart contracts
│   ├── src/                 # Solidity sources (BloomoraGarden.sol)
│   ├── test/                # Forge tests
│   ├── script/              # Deployment scripts
│   └── foundry.toml         # Foundry configuration
├── src/
│   ├── components/          # React UI components
│   ├── garden/              # Procedural garden engine (Canvas, PlantDNA, Weather)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities, constants, wagmi config
│   ├── providers/           # Context providers (AppProviders)
│   ├── services/            # AI Gardener, API clients
│   ├── stores/              # Zustand state stores
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Entry point
│   └── index.css            # Design system tokens and global styles
├── .agents/skills/          # AI agent skills for development assistance
├── .env.example             # Environment variable template
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for smart contract development)
- A WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- A wallet with testnet or mainnet funds on Base

### Installation

```bash
git clone https://github.com/U-GOD/bloomora.git
cd bloomora
npm install
```

### Environment Setup

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env
```

Required variables:

```
VITE_WC_PROJECT_ID=your_walletconnect_project_id
VITE_ALCHEMY_BASE_KEY=your_alchemy_key
VITE_PARTNER_ID=0
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Smart Contracts

```bash
cd contracts
forge build
forge test
```

---

## Supported Vaults and Chains

### Vault Addresses

| Vault | Address | Underlying | Chains |
|-------|---------|-----------|--------|
| yoUSD | `0x0000000f2eb9f69274678c76222b35eec7588a65` | USDC | Base, Ethereum, Arbitrum |
| yoETH | `0x3a43aec53490cb9fa922847385d82fe25d0e9de7` | WETH | Base, Ethereum |
| yoBTC | `0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc` | cbBTC | Base, Ethereum |
| yoEUR | `0x50c749ae210d3977adc824ae11f3c7fd10c871e9` | EURC | Base, Ethereum |
| yoGOLD | `0x586675A3a46B008d8408933cf42d8ff6c9CC61a1` | XAUt | Ethereum |

### Infrastructure

| Contract | Address |
|----------|---------|
| yoGateway | `0xF1EeE0957267b1A474323Ff9CfF7719E964969FA` |
| Vault Registry | `0x56c3119DC3B1a75763C87D5B0A2C55e489502232` |

---

## Architecture

```
User Wallet
    │
    ├── Connect via RainbowKit + wagmi
    │
    ▼
┌─────────────────────────────────────────────┐
│  Bloomora Frontend (React + TypeScript)     │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Garden   │  │ Vault    │  │ AI        │ │
│  │ Canvas   │  │ Dashboard│  │ Gardener  │ │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘ │
│       │              │              │       │
│       ▼              ▼              ▼       │
│  ┌──────────────────────────────────────┐   │
│  │  YO SDK (@yo-protocol/react + core) │   │
│  │  useVaults, useDeposit, useRedeem   │   │
│  └─────────────────┬────────────────────┘   │
└────────────────────┼────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  YO Protocol Vaults   │
         │  (ERC-4626 on Base)   │
         │  yoGateway Contract   │
         └───────────────────────┘
```

---

## Design Philosophy

Bloomora is built on three principles:

1. **Emotional DeFi** -- Yield farming is abstract and boring for most users. By mapping financial growth to visual garden growth, Bloomora creates an emotional connection that drives daily engagement.

2. **Zero Trust Overhead** -- Bloomora smart contracts never hold user funds. All deposits flow directly through YO Protocol's audited yoGateway contracts. Our contracts only handle garden NFT metadata and event logging.

3. **Mobile-First, Premium Feel** -- Dark garden theme with glassmorphism cards, micro-animations, and responsive layouts from 360px to 1440px+. The experience should feel like a premium consumer app, not a DeFi dashboard.

---

## Security Considerations

- User funds are managed exclusively by YO Protocol's audited ERC-4626 vaults and yoGateway
- Bloomora contracts are limited to NFT minting and event logging with no fund management logic
- All vault interactions use the official `@yo-protocol/core` SDK with built-in slippage protection
- Risk levels are transparently displayed with on-chain verification links
- Async redemption states are clearly communicated to prevent user confusion

---

## Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

```bash
# Fork and clone the repo
git checkout -b feature/your-feature
npm run build    # Verify the build passes
# Submit a pull request
```

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

Built with heart for the YO SDK Hackathon 2026 <3
