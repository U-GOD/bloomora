import { useVaults } from '@yo-protocol/react'
import { VAULT_GARDEN_MAP, type VaultName } from '@/lib/constants'
import { formatAPY } from '@/lib/utils'

export function VaultDashboard() {
  const { vaults, isLoading, error } = useVaults()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 h-40 animate-pulse">
            <div className="h-4 bg-garden-surface-hover rounded w-1/2 mb-4" />
            <div className="h-6 bg-garden-surface-hover rounded w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center text-garden-danger">
        Failed to load vaults: {error.message}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">🌿 Your Garden Vaults</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaults?.map((vault) => {
          const gardenInfo = VAULT_GARDEN_MAP[vault.name as string as VaultName]
          return (
            <div
              key={vault.contracts.vaultAddress}
              className="glass-card p-6 cursor-pointer hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{gardenInfo?.emoji ?? '🌱'}</span>
                <div>
                  <h3 className="font-semibold text-text-primary">{vault.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {gardenInfo?.label ?? vault.name}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">APY</p>
                  <p className="text-xl font-bold text-garden-accent">
                    {vault.yield?.['7d'] ? formatAPY(Number(vault.yield['7d']) * 100) : '—'}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    gardenInfo?.riskLevel === 'low'
                      ? 'bg-green-500/20 text-green-400'
                      : gardenInfo?.riskLevel === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {gardenInfo?.riskLevel ?? 'medium'} risk
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
