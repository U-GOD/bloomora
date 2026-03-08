import { useVaults } from '@yo-protocol/react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { VAULT_GARDEN_MAP, type VaultName } from '@/lib/constants'
import { formatAPY } from '@/lib/utils'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between border-b border-garden-accent/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Bloomora</h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
        {!isConnected ? (
          <WelcomeSection />
        ) : (
          <VaultDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 text-center text-text-muted text-sm border-t border-garden-accent/10">
        Powered by{' '}
        <a
          href="https://yo.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-garden-accent hover:text-garden-accent-light transition-colors"
        >
          YO Protocol
        </a>
        {' '}· Built for YO SDK Hackathon 2026
      </footer>
    </div>
  )
}

function WelcomeSection() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
      <div className="text-6xl animate-[fadeInUp_0.6s_ease-out]">🌱</div>
      <div className="animate-[fadeInUp_0.8s_ease-out]">
        <h2 className="text-3xl font-bold text-text-primary mb-3">
          The Living Yield Garden
        </h2>
        <p className="text-text-secondary max-w-md mx-auto text-lg">
          Plant your savings into YO vaults and watch your garden grow.
          Real deposits. Real yield. Beautiful growth.
        </p>
      </div>
      <div className="animate-[fadeInUp_1s_ease-out]">
        <ConnectButton />
      </div>
    </div>
  )
}

function VaultDashboard() {
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

export default App
