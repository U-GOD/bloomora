import { useEffect, useRef } from 'react'
import { useVaults } from '@yo-protocol/react'
import { useGardenStore } from '@/stores/useGardenStore'
import { getWeather } from '@/garden/PlantDNA'

const POLL_INTERVAL_MS = 30_000
const GROWTH_TICK_SEC = 30

/**
 * Polls vault APY data and advances all plants' maturity on a 30s interval.
 * Also derives the garden weather state from APY volatility.
 */
export function useGardenGrowth() {
  const { vaults } = useVaults()
  const updateAllPlants = useGardenStore((s) => s.updateAllPlants)
  const setWeather = useGardenStore((s) => s.setWeather)
  const plants = useGardenStore((s) => s.plants)
  const apyHistoryRef = useRef<number[]>([])
  const tvlHistoryRef = useRef<number[]>([])

  useEffect(() => {
    if (!vaults?.length || plants.length === 0) return

    function tick() {
      // Average APY across all vaults the user has plants in
      const activeVaultNames = new Set(plants.map((p) => p.vaultName))
      const relevantVaults = vaults!.filter(
        (v) => activeVaultNames.has(v.name) || activeVaultNames.has(v.id)
      )

      if (relevantVaults.length === 0) return

      const avgAPY =
        relevantVaults.reduce((sum, v) => {
          const y = v.yield?.['7d']
          return sum + (y ? Number(y) * 100 : 0)
        }, 0) / relevantVaults.length

      const avgTVL =
        relevantVaults.reduce((sum, v) => {
          const tvl = v.tvl?.formatted
          return sum + (tvl ? Number(tvl) : 0)
        }, 0) / relevantVaults.length

      // Track history for weather derivation (last 10 ticks ≈ 5 min window)
      apyHistoryRef.current = [...apyHistoryRef.current.slice(-9), avgAPY]
      tvlHistoryRef.current = [...tvlHistoryRef.current.slice(-9), avgTVL]

      updateAllPlants(avgAPY, GROWTH_TICK_SEC)

      if (apyHistoryRef.current.length >= 3) {
        const weather = getWeather(apyHistoryRef.current, tvlHistoryRef.current)
        setWeather(weather)
      }
    }

    tick()
    const id = setInterval(tick, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [vaults, plants.length, updateAllPlants, setWeather])
}
