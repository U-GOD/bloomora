import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WelcomeSection() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-8 py-20 text-center w-full h-full">
      {/* Premium ambient glow behind the landing page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-garden-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-7xl animate-[fadeInUp_0.6s_ease-out]">🌱</div>
      <div className="relative z-10 animate-[fadeInUp_0.8s_ease-out]">
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
          The Living Yield Garden
        </h2>
        <p className="text-text-secondary max-w-lg mx-auto text-lg leading-relaxed">
          Plant your savings into YO vaults and watch your garden grow.
          <br className="hidden md:block" />
          Real deposits. Real yield. Beautiful growth.
        </p>
      </div>
      <div className="relative z-10 animate-[fadeInUp_1s_ease-out] mt-4">
        <ConnectButton />
      </div>
    </div>
  )
}
