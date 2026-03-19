import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavingsGoal {
  name: string
  targetAmount: number
  targetTimestamp: number
  createdAt: number
}

interface GoalState {
  goal: SavingsGoal | null
  setGoal: (name: string, amount: number, dateString: string) => void
  clearGoal: () => void
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goal: null,
      
      setGoal: (name, amount, dateString) => {
        // Parse dateString (e.g., '2026-12-31') into timestamp
        const targetDate = new Date(dateString)
        // Default to end of day
        targetDate.setHours(23, 59, 59, 999)
        
        set({
          goal: {
            name,
            targetAmount: amount,
            targetTimestamp: targetDate.getTime(),
            createdAt: Date.now(),
          }
        })
      },
      
      clearGoal: () => set({ goal: null })
    }),
    {
      name: 'bloomora-goal-storage'
    }
  )
)
