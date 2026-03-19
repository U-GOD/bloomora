import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CoopMember {
  address: string
  joinedAt: number
  displayName: string
}

interface CoopState {
  // Group info
  coopName: string | null
  coopId: string | null
  members: CoopMember[]
  createdAt: number | null

  // Actions
  createCoop: (name: string, founderAddress: string) => void
  joinCoop: (coopId: string, address: string) => void
  leaveCoop: () => void
  getInviteLink: () => string
}

function generateCoopId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export const useCoopStore = create<CoopState>()(
  persist(
    (set, get) => ({
      coopName: null,
      coopId: null,
      members: [],
      createdAt: null,

      createCoop: (name: string, founderAddress: string) => {
        const id = generateCoopId()
        set({
          coopName: name,
          coopId: id,
          createdAt: Date.now(),
          members: [
            {
              address: founderAddress,
              joinedAt: Date.now(),
              displayName: shortenAddress(founderAddress),
            },
          ],
        })
      },

      joinCoop: (coopId: string, address: string) => {
        const { members } = get()
        // Prevent duplicates
        if (members.some((m) => m.address.toLowerCase() === address.toLowerCase())) return

        set({
          coopId,
          members: [
            ...members,
            {
              address,
              joinedAt: Date.now(),
              displayName: shortenAddress(address),
            },
          ],
        })
      },

      leaveCoop: () => {
        set({
          coopName: null,
          coopId: null,
          members: [],
          createdAt: null,
        })
      },

      getInviteLink: () => {
        const { coopId } = get()
        if (!coopId) return ''
        return `${window.location.origin}${window.location.pathname}?coop=${coopId}`
      },
    }),
    {
      name: 'bloomora-coop-storage',
    }
  )
)
