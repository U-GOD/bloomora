import { useVaults } from '@yo-protocol/react'
import { DepositWizard } from './DepositWizard'
import { RedeemWizard } from './RedeemWizard'
import { VaultCard } from './VaultCard'

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
        {vaults?.map((vault) => (
          <VaultCard key={vault.contracts.vaultAddress} vault={vault} />
        ))}
      </div>

      <DepositWizard />
      <RedeemWizard />
    </div>
  )
}

