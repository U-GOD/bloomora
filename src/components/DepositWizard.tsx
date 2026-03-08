import { useState } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import { useDeposit, useApprove, useVaults } from '@yo-protocol/react'
import { VAULTS, YO_GATEWAY_ADDRESS } from '@yo-protocol/core'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { useGardenStore } from '@/stores/useGardenStore'
import { VAULT_GARDEN_MAP, PRIMARY_CHAIN_ID, type VaultName } from '@/lib/constants'
import { createPlantFromDeposit } from '@/garden/PlantDNA'

export function DepositWizard() {
  const { address } = useAccount()
  const selectedVaultName = useGardenStore((s) => s.selectedVaultForDeposit)
  const setSelectedVaultName = useGardenStore((s) => s.setSelectedVaultForDeposit)
  const triggerGrowthEvent = useGardenStore((s) => s.triggerGrowthEvent)
  const addPlant = useGardenStore((s) => s.addPlant)

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'input' | 'approving' | 'depositing' | 'success'>('input')
  const [txHash, setTxHash] = useState<string | null>(null)

  // Use the SDK to get vault config
  // Need to safely handle the null case if the dialog is closed
  const safeVaultName = selectedVaultName ?? 'yoUSD'
  const vaultConfig = VAULTS[safeVaultName as keyof typeof VAULTS]
  const { vaults } = useVaults()
  const vaultStats = vaults?.find(v => v.name === safeVaultName || v.id === safeVaultName)
  const yield7d = vaultStats?.yield?.['7d']

  // SDK approve hook for the underlying asset -> yoGateway
  const { approve } = useApprove({
    token: vaultConfig.underlying.address[PRIMARY_CHAIN_ID] as `0x${string}`,
    spender: YO_GATEWAY_ADDRESS as `0x${string}`,
  })

  // SDK deposit hook
  const { deposit } = useDeposit({
    vault: safeVaultName,
    onSubmitted: (hash) => {
      setTxHash(hash)
      setStep('success')
      triggerGrowthEvent(safeVaultName as VaultName, amount, hash)

      if (selectedVaultName) {
        const gardenInfo = VAULT_GARDEN_MAP[selectedVaultName as VaultName]
        const apy = yield7d ? Number(yield7d) * 100 : 0
        
        // Spawn the procedural plant on the canvas
        addPlant(
          createPlantFromDeposit({
            vaultName: selectedVaultName,
            // @ts-ignore - Safely grabbing the vault address
            vaultAddress: vaultConfig.address?.[PRIMARY_CHAIN_ID] || '0x0',
            species: gardenInfo.species,
            depositAmount: amount,
            txHash: hash,
            color: gardenInfo.color,
            currentAPY: apy,
          })
        )
      }
    },
  })

  if (!selectedVaultName) return null

  const gardenInfo = VAULT_GARDEN_MAP[selectedVaultName as VaultName]

  const handleExecute = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return

    try {
      setStep('approving')
      const parsedAmount = parseUnits(amount, vaultConfig.underlying.decimals)
      
      // Execute standard ERC-4626 flow: Approve -> Deposit via Gateway
      await approve(parsedAmount)
      
      setStep('depositing')
      await deposit({
        token: vaultConfig.underlying.address[PRIMARY_CHAIN_ID] as `0x${string}`,
        amount: parsedAmount
      })
    } catch (error) {
      console.error('Deposit failed:', error)
      setStep('input') // Reset on failure
    }
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
            <span className="text-3xl">{gardenInfo.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Plant {selectedVaultName}</h2>
              <p className="text-sm text-text-secondary">Grow a {gardenInfo.label}</p>
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
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Deposit Amount ({vaultConfig.underlying.symbol})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-3 text-2xl font-semibold text-text-primary focus:outline-none focus:border-garden-accent transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                  {vaultConfig.underlying.symbol}
                </div>
              </div>
              {/* Mock balance context */}
              <div className="flex justify-between mt-2 text-xs text-text-muted">
                <span>Wallet Balance</span>
                <span className="font-medium text-text-primary">--- {vaultConfig.underlying.symbol}</span>
              </div>
            </div>

            <div className="bg-garden-surface-hover rounded-xl p-4 border border-garden-accent/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Expected Output</span>
                <span className="text-text-primary font-medium">~{amount || '0.00'} shares</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Current APY</span>
                <span className="text-garden-accent font-medium">
                  {yield7d ? (Number(yield7d) * 100).toFixed(2) : '--'}%
                </span>
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={!amount || Number(amount) <= 0 || !address}
              className="w-full bg-garden-accent hover:bg-garden-accent-light text-black font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {!address ? 'Connect Wallet' : 'Plant Seeds (Approve & Deposit)'}
            </button>
          </div>
        )}

        {/* Approving Step */}
        {step === 'approving' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-garden-accent animate-spin" />
            <h3 className="text-xl font-bold text-text-primary">Approving Tokens</h3>
            <p className="text-text-secondary">Please confirm the approval in your wallet</p>
          </div>
        )}

        {/* Depositing Step */}
        {step === 'depositing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-garden-accent animate-spin" />
            <h3 className="text-xl font-bold text-text-primary">Planting Seeds</h3>
            <p className="text-text-secondary">Executing deposit via yoGateway...</p>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-garden-accent" />
            <h3 className="text-2xl font-bold text-text-primary">Successfully Planted!</h3>
            <p className="text-text-secondary">
              Your {gardenInfo.label} has been planted and will begin growing immediately based on real yield.
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
