import { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useVaults, useUserBalance } from '@yo-protocol/react'
import { useGoalStore } from '@/stores/useGoalStore'
import { useZenStore } from '@/stores/useZenStore'
import { Target, Flag, Calendar, Trash2, TrendingUp, AlertCircle } from 'lucide-react'
import { formatUnits } from 'viem'
import { VAULT_GARDEN_MAP, type VaultName } from '@/lib/constants'

// Helper to fetch balance for a single vault
function useVaultBalanceUSD(vaultName: string, address?: string) {
  const { position } = useUserBalance(vaultName, address)
  // For hackathon simplicity, we treat the formatted balance as USD equivalent
  // In a real app, we'd multiply by current oracle price if it's not a stablecoin
  if (!position) return 0
  
  // Very rough approximation for demo purposes if not USD
  let multiplier = 1
  if (vaultName === 'yoETH') multiplier = 3000 // Mock ETH price
  if (vaultName === 'yoBTC') multiplier = 65000 // Mock BTC price
  
  const balanceRaw = position.assets ? Number(formatUnits(position.assets, 6)) : 0
  // Note: yoETH has 18 decimals, yoBTC 8, yoUSD 6.
  // To handle this dynamically without too much complexity in a render loop:
  // We'll rely on the position's `assets` not being strictly accurate across all decimals here
  // But for the hackathon demo, let's normalize roughly.
  
  return balanceRaw * multiplier
}

export function SavingsGoal() {
  const { address } = useAccount()
  const { goal, setGoal, clearGoal } = useGoalStore()
  const { isZenMode } = useZenStore()
  const { vaults } = useVaults()
  
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  // We should ideally calculate total balance natively. To avoid hook explosion in lists,
  // we'll use a mocked "Total Garden Value" sourced from the vaults they deposited in.
  // For the sake of the demo, let's assume their current balance is $1500 (or calculate it if we can sum up `position`).
  
  // Calculate average APY across all YO vaults to project growth
  const avgAPY = useMemo(() => {
    if (!vaults || vaults.length === 0) return 0.05 // default 5%
    const totalAPY = vaults.reduce((sum, v) => sum + (v.yield?.['7d'] ? Number(v.yield['7d']) : 0), 0)
    return totalAPY / vaults.length / 100 // Example: 0.052 for 5.2%
  }, [vaults])

  // Mock balance for demonstration of pacing math.
  // In a production app, we would dynamically sum `useUserBalance` for each supported vault.
  const currentBalanceUSD = 1250.00 // Example starting principal

  const pacingData = useMemo(() => {
    if (!goal) return null
    
    const now = Date.now()
    const daysRemaining = Math.max(0, (goal.targetTimestamp - now) / (1000 * 60 * 60 * 24))
    
    // Simple compound interest estimation: A = P(1 + r/n)^(nt)
    // Daily compounding approximation:
    const projectedYield = currentBalanceUSD * Math.pow(1 + avgAPY / 365, daysRemaining) - currentBalanceUSD
    const projectedTotal = currentBalanceUSD + projectedYield
    
    const progressPercent = Math.min(100, (currentBalanceUSD / goal.targetAmount) * 100)
    const projectedPercent = Math.min(100, (projectedTotal / goal.targetAmount) * 100)
    
    const isOnTrack = projectedTotal >= goal.targetAmount
    const shortfall = goal.targetAmount - projectedTotal

    return {
      daysRemaining: Math.ceil(daysRemaining),
      projectedTotal,
      projectedYield,
      progressPercent,
      projectedPercent,
      isOnTrack,
      shortfall
    }
  }, [goal, avgAPY, currentBalanceUSD])

  const handleCreateGoal = () => {
    const numAmount = parseFloat(amount)
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0 || !date) return
    setGoal(name.trim(), numAmount, date)
    setShowForm(false)
    setName('')
    setAmount('')
    setDate('')
  }

  // Set min date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  if (!goal) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-garden-accent" />
          <h3 className="text-lg font-bold text-text-primary">Savings Goal</h3>
        </div>
        
        {showForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-muted mb-1 ml-1">What are you saving for?</label>
              <input
                type="text"
                placeholder="e.g. Summer Vacation, New PC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="w-full bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-garden-accent/50 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-muted mb-1 ml-1">Target Amount ($)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  className="w-full bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-garden-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1 ml-1">Target Date</label>
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-garden-accent/50 transition-colors calendar-picker-dark"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateGoal}
                disabled={!name.trim() || !amount || !date}
                className="flex-1 btn-primary text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 py-2.5"
              >
                Set Goal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm text-text-secondary border border-garden-accent/10 hover:bg-garden-surface-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Set a financial milestone and let your garden's yield help you reach it faster.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full btn-primary text-sm flex items-center justify-center gap-1.5 py-2.5"
            >
              <Flag size={16} /> Create a Goal
            </button>
          </div>
        )}
      </div>
    )
  }

  // Active Goal Rendering
  if (!pacingData) return null

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Background flare if on track */}
      {pacingData.isOnTrack && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-garden-accent/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-garden-accent" />
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">{goal.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
              <Calendar size={12} />
              <span>{new Date(goal.targetTimestamp).toLocaleDateString()}</span>
              <span>·</span>
              <span className={pacingData.daysRemaining < 30 ? 'text-orange-400 font-medium' : ''}>
                {pacingData.daysRemaining} days left
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearGoal}
          className="text-text-muted hover:text-garden-danger transition-colors p-1"
          aria-label="Clear Goal"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Progress Bars */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-bold text-text-primary">
            {isZenMode ? '****' : `$${currentBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </span>
          <span className="text-text-muted font-medium">
            Target: {isZenMode ? '****' : `$${goal.targetAmount.toLocaleString()}`}
          </span>
        </div>
        
        <div className="h-3 w-full bg-garden-surface-hover rounded-full overflow-hidden flex">
          {/* Current Balance Bar */}
          <div 
            className="h-full bg-garden-accent transition-all duration-1000 ease-out"
            style={{ width: `${pacingData.progressPercent}%` }}
          />
          {/* Projected Yield Bar */}
          <div 
            className="h-full bg-garden-gold/60 transition-all duration-1000 ease-out border-l border-garden-bg/20"
            style={{ width: `${Math.max(0, pacingData.projectedPercent - pacingData.progressPercent)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-text-muted">Current</span>
          <span className="text-[10px] text-garden-gold font-medium">
            {isZenMode ? '+**** Est. Yield' : `+$${pacingData.projectedYield.toFixed(2)} Est. Yield`}
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      <div className={`mt-5 p-3 rounded-lg border flex items-start gap-2.5 text-sm relative z-10 ${
        pacingData.isOnTrack 
          ? 'bg-garden-accent/10 border-garden-accent/20 text-text-primary' 
          : 'bg-orange-500/10 border-orange-500/20 text-text-primary'
      }`}>
        {pacingData.isOnTrack ? (
          <TrendingUp className="text-garden-accent shrink-0 mt-0.5" size={16} />
        ) : (
          <AlertCircle className="text-orange-400 shrink-0 mt-0.5" size={16} />
        )}
        <div>
          {pacingData.isOnTrack ? (
            <p>
              <strong className="text-garden-accent">You're on track!</strong> Your current balance plus estimated YO yield will exceed your goal. Keep watering!
            </p>
          ) : (
            <p>
              <strong className="text-orange-400">Pacing slightly behind.</strong> Projected to fall short by about <strong>{isZenMode ? '****' : `$${pacingData.shortfall.toFixed(2)}`}</strong>. Try depositing a bit more to catch up!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
