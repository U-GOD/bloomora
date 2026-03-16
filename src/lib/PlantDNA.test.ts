import { describe, it, expect } from 'vitest'
import {
  sigmoidDerivative,
  updatePlantGrowth,
  getWeather,
  createPlantFromDeposit,
  type PlantDNA,
} from '../garden/PlantDNA'

// ── sigmoidDerivative ────────────────────────────────────────────

describe('sigmoidDerivative', () => {
  it('peaks near maturity 0.5', () => {
    const atMid = sigmoidDerivative(0.5)
    const atLow = sigmoidDerivative(0.1)
    const atHigh = sigmoidDerivative(0.9)

    expect(atMid).toBeGreaterThan(atLow)
    expect(atMid).toBeGreaterThan(atHigh)
  })

  it('returns a value between 0 and 1 at extremes', () => {
    expect(sigmoidDerivative(0)).toBeGreaterThanOrEqual(0)
    expect(sigmoidDerivative(1)).toBeGreaterThanOrEqual(0)
    expect(sigmoidDerivative(0)).toBeLessThan(1)
  })
})

// ── updatePlantGrowth ────────────────────────────────────────────

describe('updatePlantGrowth', () => {
  const basePlant: PlantDNA = {
    id: 'test-plant-1',
    species: 'lavender',
    vaultAddress: '0x0000000000000000000000000000000000000001',
    vaultName: 'yoUSD',
    depositAmount: '100',
    depositTxHash: '0xabc',
    depositTimestamp: Math.floor(Date.now() / 1000),
    growthRate: 0,
    maturity: 0,
    health: 1,
    mutations: [],
    color: { h: 270, s: 60, l: 70 },
    position: { x: 0.5, y: 0.6 },
  }

  it('increases maturity over time', () => {
    const updated = updatePlantGrowth(basePlant, 10, 86400) // 10% APY, 1 day
    expect(updated.maturity).toBeGreaterThan(0)
  })

  it('caps maturity at 1.0', () => {
    const maturePlant = { ...basePlant, maturity: 0.999 }
    const updated = updatePlantGrowth(maturePlant, 500, 86400 * 365)
    expect(updated.maturity).toBeLessThanOrEqual(1.0)
  })

  it('unlocks mutations at thresholds', () => {
    const midPlant = { ...basePlant, maturity: 0.24 }
    const updated = updatePlantGrowth(midPlant, 100, 86400 * 30)
    // With 100% APY for 30 days, maturity should cross 0.25
    if (updated.maturity > 0.25) {
      expect(updated.mutations).toContain('first_bloom')
    }
  })

  it('updates growthRate to currentAPY', () => {
    const updated = updatePlantGrowth(basePlant, 7.5, 3600)
    expect(updated.growthRate).toBe(7.5)
  })
})

// ── getWeather ───────────────────────────────────────────────────

describe('getWeather', () => {
  it('returns golden_hour for stable APY and growing TVL', () => {
    const stableAPY = [5.0, 5.01, 5.0, 5.02, 5.01, 5.0, 5.01]
    const growingTVL = [100, 101, 102, 103, 104, 105, 106, 108]
    expect(getWeather(stableAPY, growingTVL)).toBe('golden_hour')
  })

  it('returns sunny for low volatility', () => {
    const lowVolAPY = [5.0, 5.1, 5.05, 5.12, 5.08, 5.11, 5.09]
    const flatTVL = [100, 100, 100, 100, 100, 100, 100, 100]
    expect(getWeather(lowVolAPY, flatTVL)).toBe('sunny')
  })

  it('returns stormy for high volatility', () => {
    const wildAPY = [2.0, 8.0, 1.0, 9.0, 3.0, 7.0, 0.5]
    const flatTVL = [100, 100, 100, 100, 100, 100, 100, 100]
    expect(getWeather(wildAPY, flatTVL)).toBe('stormy')
  })
})

// ── createPlantFromDeposit ───────────────────────────────────────

describe('createPlantFromDeposit', () => {
  it('creates a valid PlantDNA with correct species', () => {
    const plant = createPlantFromDeposit({
      vaultName: 'yoETH',
      vaultAddress: '0x0000000000000000000000000000000000000002',
      species: 'oak_tree',
      depositAmount: '1.5',
      txHash: '0xdef',
      color: { h: 210, s: 70, l: 60 },
      currentAPY: 5.0,
    })

    expect(plant.species).toBe('oak_tree')
    expect(plant.vaultName).toBe('yoETH')
    expect(plant.maturity).toBe(0)
    expect(plant.health).toBe(1.0)
    expect(plant.mutations).toEqual([])
    expect(plant.position.x).toBeGreaterThanOrEqual(0.15)
    expect(plant.position.x).toBeLessThanOrEqual(0.85)
  })

  it('generates unique IDs for each plant', () => {
    const plant1 = createPlantFromDeposit({
      vaultName: 'yoUSD',
      vaultAddress: '0x0000000000000000000000000000000000000001',
      species: 'lavender',
      depositAmount: '100',
      txHash: '0x111',
      color: { h: 270, s: 60, l: 70 },
      currentAPY: 3.0,
    })
    const plant2 = createPlantFromDeposit({
      vaultName: 'yoUSD',
      vaultAddress: '0x0000000000000000000000000000000000000001',
      species: 'lavender',
      depositAmount: '200',
      txHash: '0x222',
      color: { h: 270, s: 60, l: 70 },
      currentAPY: 3.0,
    })

    expect(plant1.id).not.toBe(plant2.id)
  })
})
