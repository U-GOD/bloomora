import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WelcomeSection } from '@/components/WelcomeSection'
import { VaultDashboard } from '@/components/VaultDashboard'
import { GardenCanvas } from '@/garden/GardenCanvas'
import { RiskDisclosure } from '@/components/shared/RiskDisclosure'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-dvh flex flex-col bg-garden-bg overflow-hidden">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between border-b border-garden-accent/10 bg-garden-bg/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌸</span>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Bloomora</h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex pt-[76px] h-dvh">
        {!isConnected ? (
          <div className="w-full h-full flex items-center justify-center overflow-auto align-center m-auto">
            <WelcomeSection />
          </div>
        ) : (
          <div className="flex w-full h-full">
            {/* Left Side: Permanent Visual Canvas */}
            <div className="w-1/2 h-full relative border-r border-garden-accent/10 bg-garden-bg-secondary hidden lg:block">
              <div className="absolute inset-0 p-6 flex flex-col items-center">
                 <div className="w-full flex-1 rounded-2xl overflow-hidden glass-card shadow-2xl relative h-full">
                   <GardenCanvas fullHeight />
                 </div>
              </div>
            </div>

            {/* Right Side: Scrollable Dashboard */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto px-6 py-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8 pb-12">
                <VaultDashboard />
                
                <RiskDisclosure />

                {/* Footer */}
                <footer className="pt-12 text-center text-text-muted text-sm">
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
