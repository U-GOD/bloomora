interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="font-body selection:bg-primary-container selection:text-on-primary-container bg-background text-on-surface min-h-dvh">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-emerald-950/40 backdrop-blur-xl shadow-[0_24px_48px_rgba(110,231,183,0.06)]">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌸</span>
            <span className="text-2xl font-black text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.5)] font-headline tracking-tight">Bloomora</span>
          </div>
          <button 
            onClick={onEnterApp}
            className="bg-primary text-on-primary font-label font-bold py-2.5 px-6 rounded-full text-sm hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Enter App
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-6 py-16 flex flex-col items-center text-center">
          <div className="mb-12 relative w-full aspect-square max-w-sm">
            {/* Glowing Terrarium Visual */}
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border border-primary/20 glass-card flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-primary to-transparent"></div>
                <img 
                  alt="Neon glowing bonsai in glass terrarium" 
                  className="w-48 h-48 object-contain drop-shadow-[0_0_25px_rgba(170,255,216,0.6)]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2gKPK2pTbzbBHAklYrLG19YvKXae3QIe2LVLyC1WYFGrVFxMj3wWakfnPj7llCLQSYgNflhQQzKve4zc_OzEQw-4qvGaB2IqMhG0XRdjgEFoc2NN05phrn5biIV1EPFQANw6eW8KFFN0gy4SfBC03R_H5dVQC4THiOsRYTeIlJTxdQdZgFB-GMCuVNzFfTzVkDoHYtY4DjUMQVzdFhUizCYj-3njNCo8Eg020sOAgGRhbaMYK3DPoop0GKkbOuhuhhyWKxPtY-Zvi" 
                />
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 bg-secondary-container/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-secondary/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <span className="text-secondary font-label text-xs font-bold">+12.4% APY</span>
            </div>
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-background leading-tight mb-6">
            Watch your wealth grow. <span className="text-primary italic">Literally.</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-md">
            Transform your passive DeFi savings into a living digital garden. Deposit assets, earn real yield powered by YO Protocol.
          </p>
          <button 
            onClick={onEnterApp}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-label font-bold text-on-primary bg-primary rounded-full overflow-hidden shadow-[0_0_20px_rgba(170,255,216,0.3)] transition-all hover:shadow-[0_0_30px_rgba(170,255,216,0.5)] active:scale-95"
          >
            <span className="relative">Start Planting (Launch App)</span>
          </button>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-surface-container-low">
          <div className="mb-12">
            <span className="font-label text-primary tracking-[0.2em] text-xs font-bold uppercase block mb-4">The Ecosystem</span>
            <h2 className="font-headline text-3xl font-bold text-on-background">How It Works</h2>
          </div>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="glass-card p-8 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl font-headline font-black">01</span>
              </div>
              <div className="mb-6 w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">potted_plant</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-3 text-primary">🌱 Plant (Deposit)</h3>
              <p className="text-on-surface-variant font-body leading-relaxed">
                Deposit USDC, ETH, or BTC into battle-tested YO Protocol smart contracts.
              </p>
            </div>
            {/* Step 2 */}
            <div className="glass-card p-8 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl font-headline font-black">02</span>
              </div>
              <div className="mb-6 w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-3xl">wb_sunny</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-3 text-secondary">☀️ Grow (Earn Yield)</h3>
              <p className="text-on-surface-variant font-body leading-relaxed">
                Your deposit becomes a unique plant species that visually grows in real-time as your APY accrues.
              </p>
            </div>
            {/* Step 3 */}
            <div className="glass-card p-8 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl font-headline font-black">03</span>
              </div>
              <div className="mb-6 w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-tertiary-container text-3xl">agriculture</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-3 text-tertiary-fixed-dim">🌾 Harvest (Redeem)</h3>
              <p className="text-on-surface-variant font-body leading-relaxed">
                Withdraw your initial deposit plus all the interest you've earned at any time, with one click.
              </p>
            </div>
          </div>
        </section>

        {/* The Vaults */}
        <section className="py-20 px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold text-on-background mb-4">Choose Your Seed</h2>
            <p className="text-on-surface-variant">Each asset grows a different visual ecosystem.</p>
          </div>
          <div className="grid gap-6">
            {/* Lavender Bush */}
            <div className="bg-surface-container rounded-2xl overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img alt="Lavender digital plant" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw_2s6NGjJu4VUQwxoVPSrRjkwKwwN1nNkAF3NelwJLGatlfo9-QjN95R4ockfmPfvrOgsrWyxjeHBz__yyOkE0pKO0GUjWU81r4MKGp_h5_VnJvzqcQY7tuUZPn0GaOBn7Et4QF9ANmkkAdLyAQrvD-1akCVF-bgQuCWI2rqkgCKhuG7BkCI-KCW1mriH5iRpv8QbFosbvHpIdqGTekdiP04EmKPq9yrWnhfmuo-SPH6vKnrvnufTEy6gTqmOCbz6mcsqYdI6vhUT" />
                <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-label font-bold text-primary">LOW RISK</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface">Lavender Bush</h4>
                    <span className="text-sm font-label text-slate-400">yoUSD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-headline font-bold text-lg">5.2%</span>
                    <span className="text-[10px] block font-label text-slate-500">EST. APY</span>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-6">Calm, steady growth. Perfect for stablecoins.</p>
                <button onClick={onEnterApp} className="w-full py-3 bg-surface-container-high rounded-xl font-label font-bold text-primary hover:bg-surface-container-highest transition-colors">Plant Seed</button>
              </div>
            </div>
            
            {/* Oak Tree */}
            <div className="bg-surface-container rounded-2xl overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img alt="Oak digital tree" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUPGK89-N4LoJUg77JCVOcA9Zk-cT1YQmhcuCX7RNr2i9bsEkeNXyVKYzfnooJWbYTGZNng-K7WX_e2mdAZC93z3Pe73HeutsuA2Maj8aULAbjYkNZY05PlV_qF2TcxCxfk8hpRA5d-uKCSK7_m5cxcHwJoK5a85VJ6MgCkDnxeRWFwk5L-Id8Bn4sNwdUuiv18pW7zeOA0YV_gX9LUwHfSLQxRLux1dyW8jVaa0LkoXIyN20JPJLhVpQW8Jbi1FGT2D4Oqk8uz3cD" />
                <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-label font-bold text-secondary">MODERATE</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface">Oak Tree</h4>
                    <span className="text-sm font-label text-slate-400">yoETH</span>
                  </div>
                  <div className="text-right">
                    <span className="text-secondary font-headline font-bold text-lg">8.7%</span>
                    <span className="text-[10px] block font-label text-slate-500">EST. APY</span>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-6">Strong and reliable. Grows alongside the Ethereum ecosystem.</p>
                <button onClick={onEnterApp} className="w-full py-3 bg-surface-container-high rounded-xl font-label font-bold text-secondary hover:bg-surface-container-highest transition-colors">Plant Seed</button>
              </div>
            </div>

            {/* Golden Vine */}
            <div className="bg-surface-container rounded-2xl overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img alt="Golden digital vine" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFPVHbaVW1A6EfYOt8CaRhKajOA-FyF65_gut5otV0VGJckh4Drkt7zSvR99pPPAGjjWauvlqbQSalFHsfGZP9MXvoGt9bYlO8fcXKjEDDTCeVb9j-LJSIySOE7GGKE9YdnJWQP48k7KGZyafY3R3ivmU3y_zJE5gnOQe2aEDwqmHH-my1Xy1FsesCLIrSXDMtyWFTGnrM5YxwefyfAxFEoh4K8Jk-TGNZ9yTsnQu_qHJOaqV9TGKnHr_zOO_alVfWMRAi7RKExy6h" />
                <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-label font-bold text-error">HIGH YIELD</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface">Golden Vine</h4>
                    <span className="text-sm font-label text-slate-400">yoBTC</span>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-headline font-bold text-lg">14.1%</span>
                    <span className="text-[10px] block font-label text-slate-500">EST. APY</span>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-6">Fast-growing and unpredictable. Pure Bitcoin energy.</p>
                <button onClick={onEnterApp} className="w-full py-3 bg-surface-container-high rounded-xl font-label font-bold text-primary hover:bg-surface-container-highest transition-colors">Plant Seed</button>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="py-20 px-6 bg-surface-container-low">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
            <h2 className="font-headline text-2xl font-bold text-on-background">Fortified Growth</h2>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <div>
                <h5 className="font-label font-bold text-on-background mb-1">Audited ERC-4626 Vaults</h5>
                <p className="text-sm text-on-surface-variant leading-relaxed">Powered by YO Protocol's battle-tested infrastructure.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <div>
                <h5 className="font-label font-bold text-on-background mb-1">Real-time Risk Tracking</h5>
                <p className="text-sm text-on-surface-variant leading-relaxed">Live scoring powered by Exponential.fi integrations.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
              <div>
                <h5 className="font-label font-bold text-on-background mb-1">Non-custodial</h5>
                <p className="text-sm text-on-surface-variant leading-relaxed">Your keys, your garden, your yield. Assets never leave the contract.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-6 transform origin-bottom-right"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-4xl font-bold mb-6">Ready to bloom?</h2>
            <p className="text-on-surface-variant mb-10 mx-auto max-w-xs">Join 12,000+ gardeners cultivating the future of decentralized finance.</p>
            <button 
              onClick={onEnterApp}
              className="bg-primary text-on-primary font-label font-bold py-4 px-10 rounded-full shadow-[0_20px_40px_rgba(170,255,216,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              Open Your Garden
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e1320] w-full py-12 px-8 bg-emerald-900/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-lg font-bold text-emerald-300 font-headline flex items-center gap-2">
              <span className="text-xl">🌸</span> Bloomora
            </div>
            <div className="text-slate-500 text-sm font-body">© 2026 Bloomora. The Living Yield Garden.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-slate-500 hover:text-emerald-300 transition-colors text-sm font-body" href="https://github.com/U-GOD/bloomora">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
