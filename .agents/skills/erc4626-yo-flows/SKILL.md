---
name: erc4626-yo-flows
description: >-
  Use this skill when implementing deposit, redeem, and rebalance flows through YO Protocol's
  yoGateway and ERC-4626 vaults. Covers exact transaction sequences, decimal handling,
  slippage calculation, allowance checks, async redemption handling, and the yoGateway
  contract interface. Complements yo-protocol-sdk and yo-protocol-react skills with
  Bloomora-specific flow patterns.
author: bloomora-team
---

# ERC-4626 YO Vault Flow Patterns

## Critical: Decimal Handling

**NEVER assume 18 decimals.** Each vault has different precision:

| Vault   | Token  | Decimals |
|---------|--------|----------|
| yoETH   | WETH   | 18       |
| yoBTC   | cbBTC  | 8        |
| yoUSD   | USDC   | 6        |
| yoUSDT  | USDT   | 6        |
| yoEUR   | EURC   | 6        |
| yoGOLD  | XAUt   | 6        |

Always use `parseUnits(amount, decimals)` and `formatUnits(value, decimals)`.

## Contract Addresses (Same across Base, Ethereum, Arbitrum)

```typescript
const CONTRACTS = {
  yoGateway: '0xF1EeE0957267b1A474323Ff9CfF7719E964969FA',
  vaultRegistry: '0x56c3119DC3B1a75763C87D5B0A2C55e489502232',
  yoUSD: '0x0000000f2eb9f69274678c76222b35eec7588a65',
  yoETH: '0x3a43aec53490cb9fa922847385d82fe25d0e9de7',
  yoBTC: '0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc',
  yoEUR: '0x50c749ae210d3977adc824ae11f3c7fd10c871e9',
  yoGOLD: '0x586675A3a46B008d8408933cf42d8ff6c9CC61a1',
  yoUSDT: '0xb9a7da9e90d3b428083bae04b860faa6325b721e',
} as const
```

## Underlying Token Addresses (per chain)

```typescript
const UNDERLYING = {
  USDC: { 8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' },
  WETH: { 8453: '0x4200000000000000000000000000000000000006', 1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
  cbBTC: { 8453: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf', 1: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf' },
  EURC: { 8453: '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42', 1: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c' },
  XAUt: { 1: '0x68749665FF8D2d112Fa859AA293F07A622782F38' },
  USDT: { 1: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
} as const
```

## Deposit Flow (React — Recommended for Bloomora)

```tsx
import { useDeposit, useApprove, useVault } from '@yo-protocol/react'
import { VAULTS, YO_GATEWAY_ADDRESS } from '@yo-protocol/core'
import { parseUnits } from 'viem'

// 1. Get vault config from SDK
const vault = VAULTS.yoUSD
const chainId = 8453 // Base

// 2. Approve underlying token to yoGateway (NOT to the vault!)
const { approve } = useApprove({
  token: vault.underlying.address[chainId],
  spender: YO_GATEWAY_ADDRESS,
})

// 3. Deposit via gateway
const { deposit, isSuccess } = useDeposit({
  vault: 'yoUSD',
  onSubmitted: (hash) => console.log('Tx:', hash),
})

// 4. Execute
const amount = parseUnits('100', 6) // 100 USDC (6 decimals!)
await approve(amount)
await deposit(amount)
```

## Redeem Flow

```tsx
import { useRedeem, useUserBalance, usePendingRedemptions } from '@yo-protocol/react'

const { position } = useUserBalance('yoETH', address)
const { redeem } = useRedeem({
  vault: 'yoETH',
  onSubmitted: (hash) => console.log('Redeem tx:', hash),
})

// Redeem all shares
await redeem(position!.shares)

// IMPORTANT: Check if redemption is instant or queued!
// Use usePendingRedemptions to show pending state
const { pendingRedemptions } = usePendingRedemptions({ vault: 'yoETH', user: address })
```

## Slippage Protection

Default: 100 bps (1%) via `YieldProvider defaultSlippageBps={100}`

The yoGateway handles slippage internally:
- `quotePreviewDeposit(vault, assets)` → expected shares
- `minSharesOut = quotedShares * 99n / 100n` → 1% slippage buffer
- Protocol currently charges 0 fees

## Async Redemption Handling

When `redeem()` is called and the vault lacks liquidity:
1. Redemption is **queued** (not instant)
2. Can take **up to 24 hours** to fill
3. Assets are sent directly to receiver once filled
4. Use `usePendingRedemptions` hook to check status
5. **MUST show clear UI** explaining this to users

## Rebalance Flow (Redeem → Deposit)

```typescript
// WARNING: Async redemption means rebalance is NOT atomic
// Step 1: Redeem from source vault
await redeem(shares)
// Step 2: Wait for redemption to settle (may be instant or queued)
// Step 3: Once assets received, deposit into target vault
await deposit(amount)
```

For hackathon demo: Use yoUSD on Base which typically has instant liquidity.

## YO REST API Endpoints

Base URL: `https://api.yo.xyz`

```
GET /api/v1/vault/{network}/{vaultAddress}                              # Vault snapshot
GET /api/v1/vault/yield/timeseries/{network}/{vaultAddress}             # APY history
GET /api/v1/vault/tvl/timeseries/{network}/{vaultAddress}               # TVL history
GET /api/v1/vault/pending-redeems/{network}/{vaultAddress}              # Pending redeems
GET /api/v1/history/user/{network}/{vaultAddress}/{userAddress}         # User tx history
GET /api/v1/vault/pending-redeems/{network}/{vaultAddress}/{userAddress} # User pending
GET /api/v1/performance/user/{network}/{vaultAddress}/{userAddress}     # User P&L
```

Network values: `base`, `ethereum`, `arbitrum`
