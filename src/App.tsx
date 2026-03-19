import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WelcomeSection } from '@/components/WelcomeSection'
import { VaultDashboard } from '@/components/VaultDashboard'
import { GardenCanvas } from '@/garden/GardenCanvas'
import { RiskDisclosure } from '@/components/shared/RiskDisclosure'
import { LandingPage } from '@/pages/LandingPage'
import { WateringStreakBadge } from '@/components/WateringStreakBadge'
import { useZenStore } from '@/stores/useZenStore'
import { Eye, EyeOff } from 'lucide-react'

function App() {
  const { isConnected } = useAccount()
  const [showLanding, setShowLanding] = useState(true)
  const { isZenMode, toggleZenMode } = useZenStore()

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-dvh flex flex-col bg-garden-bg overflow-hidden">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between border-b border-garden-accent/10 bg-garden-bg/80 backdrop-blur-md">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowLanding(true)}
        >
          <span className="text-3xl">🌸</span>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Bloomora</h1>
        </div>
        
        
        <div className="flex items-center gap-4">
          {!showLanding && isConnected && (
            <>
              <button
                onClick={toggleZenMode}
                className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                  isZenMode 
                    ? 'bg-garden-surface text-garden-accent border border-garden-accent/20 hover:bg-garden-surface-hover shadow-[0_0_10px_rgba(110,231,183,0.2)]'
                    : 'text-text-muted hover:text-text-primary hover:bg-garden-surface-hover'
                }`}
                title="Toggle Zen Mode"
              >
                {isZenMode ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <WateringStreakBadge />
            </>
          )}
          <ConnectButton />
        </div>
      </header>

      {/* Full-bleed Living Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GardenCanvas fullHeight />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-[76px] h-dvh overflow-y-auto custom-scrollbar">
        {!isConnected ? (
          <div className="min-h-[calc(100vh-76px)] flex items-center justify-center p-6">
            <WelcomeSection />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Side: Empty space so the user can see their garden growing */}
              <div className="hidden lg:flex flex-1 flex-col justify-end pb-12 pointer-events-none">
                 <div className="glass-card p-6 inline-block w-fit backdrop-blur-xl border-white/10 bg-black/40 text-text-primary shadow-2xl">
                   <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🌱 The Living Yield Garden</h3>
                   <p className="text-sm text-text-secondary max-w-sm">
                     Watch your DeFi deposits grow into a thriving ecosystem. Every vault you deposit into plants a new species here.
                   </p>
                 </div>
              </div>

              {/* Right Side: Dashboard Panel (Glassmorphism) */}
              <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 space-y-6">
                <div className="glass-card p-6 md:p-8 backdrop-blur-md bg-garden-bg-secondary/80 border-garden-accent/20 shadow-2xl shadow-garden-accent/5">
                  <VaultDashboard />
                </div>
                
                <RiskDisclosure />

                {/* Footer */}
                <footer className="pt-6 pb-12 text-center text-text-muted text-xs">
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

            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
