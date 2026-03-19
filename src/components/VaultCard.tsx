import { useMemo } from 'react'
import { useVaultHistory } from '@yo-protocol/react'
import type { VaultStatsItem } from '@yo-protocol/core'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { VAULT_GARDEN_MAP, type VaultName } from '@/lib/constants'
import { formatAPY } from '@/lib/utils'
import { useGardenStore } from '@/stores/useGardenStore'
import { useZenStore } from '@/stores/useZenStore'

interface VaultCardProps {
  vault: VaultStatsItem
}

export function VaultCard({ vault }: VaultCardProps) {
  const setSelectedVaultForDeposit = useGardenStore((s) => s.setSelectedVaultForDeposit)
  const setSelectedVaultForRedeem = useGardenStore((s) => s.setSelectedVaultForRedeem)
  const isZenMode = useZenStore((s) => s.isZenMode)
  const gardenInfo = VAULT_GARDEN_MAP[vault.name as VaultName]

  // Phase 1.4: Pre-fetching historical data to fuel the Procedural Garden Engine
  const { yieldHistory, isLoading } = useVaultHistory(vault.name as VaultName)

  // Calculate garden growth metrics (multiplier & volatility) from the last 30 days
  const gardenMetrics = useMemo(() => {
    if (!yieldHistory || yieldHistory.length < 2) return null

    const sortedYields = [...yieldHistory].sort((a, b) => a.timestamp - b.timestamp)
    const oldestYield = sortedYields[0].value
    const newestYield = sortedYields[sortedYields.length - 1].value

    // Determine the trend of the APY over the period
    const trendPercentage = oldestYield > 0 ? (newestYield - oldestYield) / oldestYield : 0
    
    // The growth multiplier directly affects how fast the canvas plants will grow
    // 1.0 = normal pacing, > 1.0 = accelerated, < 1.0 = stunted
    const multiplier = Math.max(0.5, Math.min(1.5, 1 + trendPercentage))

    return {
      trendPercentage,
      multiplier,
      isPositive: trendPercentage >= 0
    }
  }, [yieldHistory])

  const yield7d = vault.yield?.['7d']

  return (
    <div className="glass-card p-6 transition-all group flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3">
          {gardenInfo?.emoji ?? '🌱'}
        </span>
        <div>
          <h3 className="font-semibold text-text-primary">{vault.name}</h3>
          <p className="text-sm text-text-secondary">
            {gardenInfo?.label ?? vault.name}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide border ${
              gardenInfo?.riskLevel === 'low'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : gardenInfo?.riskLevel === 'medium'
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {gardenInfo?.riskLevel ?? 'medium'} risk
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 my-2">
        <div className="bg-garden-surface-hover/50 rounded-lg p-3 border border-garden-accent/5">
          <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
            <Activity size={12} /> APY
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-garden-accent">
              {isZenMode ? '****' : (yield7d ? formatAPY(Number(yield7d)) : '—')}
            </p>
          </div>
          
          {/* Garden Engine Pre-compute visualizer */}
          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium">
            {!isLoading && gardenMetrics ? (
              <span className={`flex items-center gap-0.5 ${gardenMetrics.isPositive ? 'text-green-400' : 'text-yellow-400'}`}>
                {gardenMetrics.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                Growth Multiplier: {gardenMetrics.multiplier.toFixed(2)}x
              </span>
            ) : (
              <span className="text-text-muted opacity-50 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-garden-accent/50 animate-pulse" />
                Analyzing weather...
              </span>
            )}
          </div>
        </div>

        <div className="bg-garden-surface-hover/50 rounded-lg p-3 border border-garden-accent/5">
          <p className="text-xs text-text-muted mb-1">TVL</p>
          <p className="text-lg font-bold text-text-primary">
            {isZenMode ? '****' : (vault.tvl?.formatted ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(vault.tvl.formatted)) : '—')}
          </p>
          <p className="text-[10px] text-text-muted mt-1">Total locked across gardens</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-garden-accent/10">
        <button
          onClick={() => setSelectedVaultForDeposit(vault.name as VaultName)}
          className="flex-1 btn-primary text-sm flex items-center justify-center gap-1.5 px-0"
        >
          🌱 Plant
        </button>
        <button
          onClick={() => setSelectedVaultForRedeem(vault.name as VaultName)}
          className="flex-1 btn-harvest text-sm flex items-center justify-center gap-1.5 px-0"
        >
          🌾 Harvest
        </button>
      </div>
    </div>
  )
}
