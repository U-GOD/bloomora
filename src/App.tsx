import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WelcomeSection } from '@/components/WelcomeSection'
import { VaultDashboard } from '@/components/VaultDashboard'

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

export default App
