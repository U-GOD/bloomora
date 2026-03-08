/**
 * Bloomora – Plant DNA System
 *
 * Every deposit creates a plant with DNA derived from vault type, deposit amount,
 * and yield metrics. This module defines the core types and the growth algorithm
 * that drives the procedural garden engine.
 *
 * Species are mapped from YO Protocol vaults:
 *   yoUSD  → lavender   (calm, low risk)
 *   yoETH  → oak_tree   (strong, medium risk)
 *   yoBTC  → vine        (fast, high risk)
 *   yoEUR  → tulip       (orderly, low risk)
 *   yoGOLD → sunflower   (tall, medium risk)
 */

// ── Type Definitions ─────────────────────────────────────────────

export type PlantSpecies = 'lavender' | 'oak_tree' | 'vine' | 'tulip' | 'sunflower'

export type PlantMutation =
  | 'first_bloom'      // maturity > 0.25
  | 'full_canopy'      // maturity > 0.50
  | 'fruit_bearing'    // maturity > 0.75
  | 'legendary_glow'   // maturity > 0.95
  | 'crystal_petals'   // special event reward

export type WeatherState = 'sunny' | 'rainy' | 'stormy' | 'golden_hour'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface PlantDNA {
  id: string                                // Unique plant identifier
  species: PlantSpecies                     // Derived from vault type
  vaultAddress: `0x${string}`               // On-chain vault address
  vaultName: string                         // e.g. 'yoUSD'
  depositAmount: string                     // Human-readable (e.g. "100.5")
  depositTxHash: string                     // The transaction hash
  depositTimestamp: number                  // Unix seconds
  growthRate: number                        // Current APY / 365 / 100
  maturity: number                          // 0.0 → 1.0
  health: number                            // 0.0 → 1.0
  mutations: PlantMutation[]                // Visual traits unlocked over time
  color: { h: number; s: number; l: number } // HSL color derived from vault
  position: { x: number; y: number }        // Canvas position (0–1 normalized)
}

export interface GardenState {
  plants: PlantDNA[]
  weather: WeatherState
  season: Season
  totalYieldAccrued: number
  gardenScore: number
}


// ── Growth Algorithm ─────────────────────────────────────────────

/**
 * Sigmoid derivative — produces a natural S-curve for plant growth.
 * Peak growth occurs at maturity 0.5 (mid-life), tapering off at 0 and 1.
 */
export function sigmoidDerivative(x: number): number {
  const s = 1 / (1 + Math.exp(-10 * (x - 0.5)))
  return s * (1 - s) * 4
}

/**
 * Mutation thresholds — maturity values at which new visual traits unlock.
 */
const MUTATION_THRESHOLDS: { threshold: number; mutation: PlantMutation }[] = [
  { threshold: 0.25, mutation: 'first_bloom' },
  { threshold: 0.50, mutation: 'full_canopy' },
  { threshold: 0.75, mutation: 'fruit_bearing' },
  { threshold: 0.95, mutation: 'legendary_glow' },
]

/**
 * Advances a plant's maturity based on real-time yield accrual.
 *
 * @param plant      - The plant to update
 * @param currentAPY - The current vault APY as a percentage (e.g. 5.2 for 5.2%)
 * @param deltaSec   - Elapsed time in seconds since last update
 * @returns A new PlantDNA with updated maturity, mutations, and growthRate
 */
export function updatePlantGrowth(
  plant: PlantDNA,
  currentAPY: number,
  deltaSec: number,
): PlantDNA {
  const baseGrowthPerDay = currentAPY / 365 / 100
  const growthIncrement = baseGrowthPerDay * (deltaSec / 86400)
  const newMaturity = Math.min(1.0, plant.maturity + growthIncrement * sigmoidDerivative(plant.maturity))

  // Check for newly unlocked mutations
  const newMutations = [...plant.mutations]
  for (const { threshold, mutation } of MUTATION_THRESHOLDS) {
    if (newMaturity > threshold && !newMutations.includes(mutation)) {
      newMutations.push(mutation)
    }
  }

  return {
    ...plant,
    maturity: newMaturity,
    mutations: newMutations,
    growthRate: currentAPY,
  }
}


// ── Weather Algorithm ────────────────────────────────────────────

/**
 * Calculates the standard deviation of an array of numbers.
 */
function calculateVolatility(data: number[]): number {
  if (data.length < 2) return 0
  const mean = data.reduce((sum, v) => sum + v, 0) / data.length
  const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / data.length
  return Math.sqrt(variance)
}

/**
 * Derives the garden weather from recent APY and TVL data.
 * Weather is a visual representation of portfolio risk.
 *
 * - golden_hour: very stable APY + growing TVL → everything is great
 * - sunny:       low volatility → normal day
 * - rainy:       moderate volatility → caution
 * - stormy:      high volatility → danger
 */
export function getWeather(apyData: number[], tvlData: number[]): WeatherState {
  const apyVolatility = calculateVolatility(apyData.slice(-7))
  const tvlTrend =
    tvlData.length >= 8
      ? (tvlData[tvlData.length - 1] - tvlData[tvlData.length - 8]) / tvlData[tvlData.length - 8]
      : 0

  if (apyVolatility < 0.05 && tvlTrend > 0.01) return 'golden_hour'
  if (apyVolatility < 0.15) return 'sunny'
  if (apyVolatility < 0.35) return 'rainy'
  return 'stormy'
}


// ── Factory Helpers ──────────────────────────────────────────────

let plantIdCounter = 0

/**
 * Creates a new PlantDNA from a deposit event.
 * Assigns a random canvas position and initialises maturity at 0.
 */
export function createPlantFromDeposit(opts: {
  vaultName: string
  vaultAddress: `0x${string}`
  species: PlantSpecies
  depositAmount: string
  txHash: string
  color: { h: number; s: number; l: number }
  currentAPY: number
}): PlantDNA {
  plantIdCounter++
  return {
    id: `plant-${opts.vaultName}-${plantIdCounter}-${Date.now()}`,
    species: opts.species,
    vaultAddress: opts.vaultAddress,
    vaultName: opts.vaultName,
    depositAmount: opts.depositAmount,
    depositTxHash: opts.txHash,
    depositTimestamp: Math.floor(Date.now() / 1000),
    growthRate: opts.currentAPY / 365 / 100,
    maturity: 0,
    health: 1.0,
    mutations: [],
    color: opts.color,
    position: {
      x: 0.15 + Math.random() * 0.7,   // keep within 15–85% horizontal
      y: 0.55 + Math.random() * 0.3,    // lower half of canvas (ground area)
    },
  }
}
