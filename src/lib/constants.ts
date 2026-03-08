/**
 * Bloomora Constants
 * Vault-to-garden mappings, contract addresses, and chain configs
 */

export const VAULT_GARDEN_MAP = {
  yoUSD: {
    species: 'lavender' as const,
    riskLevel: 'low' as const,
    color: { h: 262, s: 83, l: 74 },  // Purple
    emoji: '🫐',
    label: 'Lavender Bush',
    description: 'Calm, steady growth. Perfect for stablecoins.',
  },
  yoETH: {
    species: 'oak_tree' as const,
    riskLevel: 'medium' as const,
    color: { h: 217, s: 91, l: 68 },  // Blue
    emoji: '🌳',
    label: 'Oak Tree',
    description: 'Strong and reliable. Grows with ETH.',
  },
  yoBTC: {
    species: 'vine' as const,
    riskLevel: 'high' as const,
    color: { h: 38, s: 92, l: 50 },   // Amber
    emoji: '🌿',
    label: 'Golden Vine',
    description: 'Fast-growing and unpredictable. Bitcoin energy.',
  },
  yoEUR: {
    species: 'tulip' as const,
    riskLevel: 'low' as const,
    color: { h: 160, s: 64, l: 55 },  // Emerald
    emoji: '🌷',
    label: 'Tulip Garden',
    description: 'Orderly blooms. Euro stability.',
  },
  yoGOLD: {
    species: 'sunflower' as const,
    riskLevel: 'medium' as const,
    color: { h: 45, s: 93, l: 58 },   // Gold
    emoji: '🌻',
    label: 'Sunflower',
    description: 'Tall and golden. Tracks the sun.',
  },
} as const

export type VaultName = keyof typeof VAULT_GARDEN_MAP
export type PlantSpecies = (typeof VAULT_GARDEN_MAP)[VaultName]['species']
export type RiskLevel = 'low' | 'medium' | 'high'

/** Supported chains for Bloomora */
export const SUPPORTED_CHAINS = {
  base: 8453,
  ethereum: 1,
  arbitrum: 42161,
} as const

/** Primary chain for the app */
export const PRIMARY_CHAIN_ID = SUPPORTED_CHAINS.base

/** Deployed contract addresses */
export const BLOOMORA_GARDEN_ADDRESS: Record<number, `0x${string}`> = {
  // Using Base Sepolia testnet address from Phase 3 deployment
  84532: '0x792ade26f657ac07e9dfb85950e8271bb7157c4a',
}
