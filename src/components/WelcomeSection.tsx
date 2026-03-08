import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WelcomeSection() {
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
