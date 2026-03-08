import { create } from 'zustand'
import type { VaultName } from '@/lib/constants'
import type { PlantDNA, WeatherState, Season } from '@/garden/PlantDNA'
import { updatePlantGrowth } from '@/garden/PlantDNA'

interface GardenStoreState {
  // ── Modal state ───────────────────────────────────────────
  selectedVaultForDeposit: VaultName | null
  setSelectedVaultForDeposit: (vault: VaultName | null) => void

  selectedVaultForRedeem: VaultName | null
  setSelectedVaultForRedeem: (vault: VaultName | null) => void

  // ── Animation triggers ────────────────────────────────────
  recentlyDeposited: { vault: VaultName; amount: string; hash: string } | null
  triggerGrowthEvent: (vault: VaultName, amount: string, hash: string) => void
  clearGrowthEvent: () => void

  recentlyHarvested: { vault: VaultName; hash: string } | null
  triggerHarvestEvent: (vault: VaultName, hash: string) => void
  clearHarvestEvent: () => void

  // ── Garden engine state ───────────────────────────────────
  plants: PlantDNA[]
  weather: WeatherState
  season: Season
  totalYieldAccrued: number
  gardenScore: number

  addPlant: (plant: PlantDNA) => void
  removePlant: (plantId: string) => void
  updateAllPlants: (currentAPY: number, deltaSec: number) => void
  setWeather: (weather: WeatherState) => void
  setSeason: (season: Season) => void
}

export const useGardenStore = create<GardenStoreState>((set) => ({
  // ── Modal state ─────────────────────────────────────────────
  selectedVaultForDeposit: null,
  setSelectedVaultForDeposit: (vault) => set({ selectedVaultForDeposit: vault }),

  selectedVaultForRedeem: null,
  setSelectedVaultForRedeem: (vault) => set({ selectedVaultForRedeem: vault }),

  // ── Animation triggers ──────────────────────────────────────
  recentlyDeposited: null,
  triggerGrowthEvent: (vault, amount, hash) =>
    set({ recentlyDeposited: { vault, amount, hash } }),
  clearGrowthEvent: () => set({ recentlyDeposited: null }),

  recentlyHarvested: null,
  triggerHarvestEvent: (vault, hash) =>
    set({ recentlyHarvested: { vault, hash } }),
  clearHarvestEvent: () => set({ recentlyHarvested: null }),

  // ── Garden engine state ─────────────────────────────────────
  plants: [],
  weather: 'sunny',
  season: 'spring',
  totalYieldAccrued: 0,
  gardenScore: 0,

  addPlant: (plant) =>
    set((state) => ({ plants: [...state.plants, plant] })),

  removePlant: (plantId) =>
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== plantId),
    })),

  updateAllPlants: (currentAPY, deltaSec) =>
    set((state) => ({
      plants: state.plants.map((p) => updatePlantGrowth(p, currentAPY, deltaSec)),
    })),

  setWeather: (weather) => set({ weather }),
  setSeason: (season) => set({ season }),
}))

