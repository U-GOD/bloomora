import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ZenState {
  isZenMode: boolean
  toggleZenMode: () => void
}

export const useZenStore = create<ZenState>()(
  persist(
    (set) => ({
      isZenMode: false,
      toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
    }),
    {
      name: 'bloomora-zen-storage',
    }
  )
)
