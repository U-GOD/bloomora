import { create } from 'zustand'
import type { VaultName } from '@/lib/constants'

interface GardenState {
  selectedVaultForDeposit: VaultName | null
  setSelectedVaultForDeposit: (vault: VaultName | null) => void
  
  // Animation triggers
  recentlyDeposited: { vault: VaultName, amount: string, hash: string } | null
  triggerGrowthEvent: (vault: VaultName, amount: string, hash: string) => void
  clearGrowthEvent: () => void
}

export const useGardenStore = create<GardenState>((set) => ({
  selectedVaultForDeposit: null,
  setSelectedVaultForDeposit: (vault) => set({ selectedVaultForDeposit: vault }),
  
  recentlyDeposited: null,
  triggerGrowthEvent: (vault, amount, hash) => set({ recentlyDeposited: { vault, amount, hash } }),
  clearGrowthEvent: () => set({ recentlyDeposited: null }),
}))
