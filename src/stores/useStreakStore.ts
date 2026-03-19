import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StreakState {
  currentStreak: number
  lastWateredDate: string | null
  waterGarden: () => void
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      lastWateredDate: null,
      waterGarden: () => {
        const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
        const { lastWateredDate, currentStreak } = get()

        if (lastWateredDate === today) return // Already watered today

        if (!lastWateredDate) {
          // First time ever
          set({ currentStreak: 1, lastWateredDate: today })
          return
        }

        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .split('T')[0]

        if (lastWateredDate === yesterday) {
          // Streak continues
          set({ currentStreak: currentStreak + 1, lastWateredDate: today })
        } else {
          // Streak broken
          set({ currentStreak: 1, lastWateredDate: today })
        }
      },
    }),
    {
      name: 'bloomora-streak-storage',
    }
  )
)
