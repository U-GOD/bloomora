import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { useRedeem, useUserPosition, usePendingRedemptions } from '@yo-protocol/react'
import { VAULTS } from '@yo-protocol/core'
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useGardenStore } from '@/stores/useGardenStore'
import { VAULT_GARDEN_MAP, PRIMARY_CHAIN_ID, BLOOMORA_GARDEN_ADDRESS, type VaultName } from '@/lib/constants'
import { BLOOMORA_ABI } from '@/lib/bloomoraAbi'
import { playSound } from '@/lib/sounds'

export function RedeemWizard() {
  const { address } = useAccount()
  const selectedVaultName = useGardenStore((s) => s.selectedVaultForRedeem)
  const setSelectedVaultName = useGardenStore((s) => s.setSelectedVaultForRedeem)
  const triggerHarvestEvent = useGardenStore((s) => s.triggerHarvestEvent)

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'input' | 'redeeming' | 'success'>('input')
  const [txHash, setTxHash] = useState<string | null>(null)

  const safeVaultName = selectedVaultName ?? 'yoUSD'
  const vaultConfig = VAULTS[safeVaultName as keyof typeof VAULTS]

  // Get user balance to display max balance
  const { position } = useUserPosition(safeVaultName, address)
  
  // Pending redemptions
  const { pendingRedemptions } = usePendingRedemptions(safeVaultName, address)
  
  const plants = useGardenStore((s) => s.plants)
  const removePlant = useGardenStore((s) => s.removePlant)

  // wagmi hook for interacting with our Garden NFT Contract
  const { writeContractAsync } = useWriteContract()

  // SDK redeem hook
  const { redeem } = useRedeem({
    vault: safeVaultName,
    onSubmitted: async (hash) => {
      setTxHash(hash)
      setStep('success')
      playSound('harvest')
      triggerHarvestEvent(safeVaultName as VaultName, hash)

      // Find one plant from this vault and harvest it visually
      if (selectedVaultName) {
        const plantToHarvest = plants.find((p) => p.vaultName === selectedVaultName)
        if (plantToHarvest) {
          removePlant(plantToHarvest.id)
        }

        const parsedShares = parseUnits(amount, 18)
        const vaultAddress = vaultConfig.address?.[PRIMARY_CHAIN_ID] as `0x${string}` || '0x0'

        // Asynchronously log the harvest event on-chain to our NFT contract
        if (BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID]) {
          try {
            await writeContractAsync({
              address: BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID],
              abi: BLOOMORA_ABI,
              functionName: 'logHarvest',
              args: [vaultAddress, parsedShares],
            })
          } catch (e) {
            console.error('Failed to log harvest on-chain:', e)
          }
        }
      }
    },
  })

  if (!selectedVaultName) return null

  const gardenInfo = VAULT_GARDEN_MAP[selectedVaultName as VaultName]
  const userShares = position ? formatUnits(position.shares, 18) : '0'

  const handleExecute = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return

    try {
      setStep('redeeming')
      const parsedShares = parseUnits(amount, 18) // Vault shares always have 18 decimals
      
      await redeem(parsedShares)
    } catch (error) {
      console.error('Redeem failed:', error)
      setStep('input') // Reset on failure
    }
  }

  const handleMax = () => {
    setAmount(userShares)
  }

  const handleClose = () => {
    setSelectedVaultName(null)
    setTimeout(() => {
      setStep('input')
      setAmount('')
      setTxHash(null)
    }, 200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="glass-card w-full max-w-md p-6 relative animate-[slideUp_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Harvest {selectedVaultName}</h2>
              <p className="text-sm text-text-secondary">Redeem {gardenInfo.label}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 -mr-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Step */}
        {step === 'input' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Redeem Shares
                </label>
                <div className="text-sm text-text-muted">
                  Max: {Number(userShares).toFixed(4)} shares
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-3 text-2xl font-semibold text-text-primary focus:outline-none focus:border-garden-accent transition-colors pr-24"
                />
                <button
                  onClick={handleMax}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-garden-surface-hover text-garden-accent hover:bg-garden-accent/10 text-sm font-bold py-1 px-3 rounded-md transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="bg-garden-surface-hover rounded-xl p-4 border border-garden-accent/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Expected Underlying Asset</span>
                <span className="text-text-primary font-medium">{vaultConfig.underlying.symbol}</span>
              </div>
              <div className="text-xs text-text-muted mt-2 px-2 border-l-2 border-garden-accent/30">
                Note: Redemptions may be asynchronous. If the vault lacks immediate liquidity, your request will be queued and fulfilled usually within 24 hours.
              </div>
            </div>

            {pendingRedemptions?.shares && Number(pendingRedemptions.shares.raw) > 0 && (
              <div className="bg-garden-danger/10 border border-garden-danger/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-garden-danger w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-garden-danger mb-1">Pending Harvest</p>
                  <p className="text-text-secondary">
                    You currently have {pendingRedemptions.shares.formatted} shares waiting to be fulfilled. 
                    Additional redemptions will skip the queue if liquidity is available, otherwise they will join the queue.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={!amount || Number(amount) <= 0 || !address || Number(amount) > Number(userShares)}
              className="w-full btn-harvest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!address ? 'Connect Wallet' : '🌾 Harvest Shares'}
            </button>
          </div>
        )}

        {/* Redeeming Step */}
        {step === 'redeeming' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-garden-gold animate-[spin_2s_linear_infinite]" />
            <h3 className="text-xl font-bold text-text-primary">Harvesting Shares</h3>
            <p className="text-text-secondary animate-pulse">Executing redemption...</p>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-garden-gold/20 blur-xl rounded-full animate-pulse" />
              <CheckCircle2 className="w-16 h-16 text-garden-gold relative z-10 animate-[bounce_1s_ease-in-out]" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">Successfully Harvested!</h3>
            <p className="text-text-secondary">
              Your {gardenInfo.label} has been harvested. Underlying assets will be transferred to your wallet.
            </p>
            {txHash && (
              <a 
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-garden-accent hover:underline mt-2"
              >
                View on BaseScan
              </a>
            )}
            <button
              onClick={handleClose}
              className="mt-6 w-full bg-garden-surface-hover hover:bg-garden-accent/20 border border-garden-accent/30 text-text-primary font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Back to Garden
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
