import { create } from 'zustand'
import type { VaultName } from '@/lib/constants'

interface GardenState {
  selectedVaultForDeposit: VaultName | null
  setSelectedVaultForDeposit: (vault: VaultName | null) => void
  
  selectedVaultForRedeem: VaultName | null
  setSelectedVaultForRedeem: (vault: VaultName | null) => void

  // Animation triggers
  recentlyDeposited: { vault: VaultName, amount: string, hash: string } | null
  triggerGrowthEvent: (vault: VaultName, amount: string, hash: string) => void
  clearGrowthEvent: () => void

  recentlyHarvested: { vault: VaultName, hash: string } | null
  triggerHarvestEvent: (vault: VaultName, hash: string) => void
  clearHarvestEvent: () => void
}

export const useGardenStore = create<GardenState>((set) => ({
  selectedVaultForDeposit: null,
  setSelectedVaultForDeposit: (vault) => set({ selectedVaultForDeposit: vault }),
  
  selectedVaultForRedeem: null,
  setSelectedVaultForRedeem: (vault) => set({ selectedVaultForRedeem: vault }),
  
  recentlyDeposited: null,
  triggerGrowthEvent: (vault, amount, hash) => set({ recentlyDeposited: { vault, amount, hash } }),
  clearGrowthEvent: () => set({ recentlyDeposited: null }),

  recentlyHarvested: null,
  triggerHarvestEvent: (vault, hash) => set({ recentlyHarvested: { vault, hash } }),
  clearHarvestEvent: () => set({ recentlyHarvested: null }),
}))
