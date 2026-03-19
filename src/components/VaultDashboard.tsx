import { useVaults } from '@yo-protocol/react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Loader2 } from 'lucide-react'
import { DepositWizard } from './DepositWizard'
import { RedeemWizard } from './RedeemWizard'
import { VaultCard } from './VaultCard'
import { GardenCooperative } from './GardenCooperative'
import { BLOOMORA_GARDEN_ADDRESS, PRIMARY_CHAIN_ID } from '@/lib/constants'
import { BLOOMORA_ABI } from '@/lib/bloomoraAbi'
import { useState } from 'react'

export function VaultDashboard() {
  const { address } = useAccount()
  const { vaults, isLoading, error } = useVaults()
  
  const [isMinting, setIsMinting] = useState(false)
  const { writeContractAsync } = useWriteContract()

  // Check if user already minted a garden
  const { data: tokenId, refetch: refetchTokenId } = useReadContract({
    address: BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID],
    abi: BLOOMORA_ABI,
    functionName: 'gardenerToGarden',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID],
    }
  })

  const hasGarden = tokenId ? Number(tokenId) > 0 : false

  const handleMintGarden = async () => {
    if (!address || !BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID]) return
    
    try {
      setIsMinting(true)
      await writeContractAsync({
        address: BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID],
        abi: BLOOMORA_ABI,
        functionName: 'plantGarden',
        // In a real app, this would point to a dynamic NFT metadata API
        args: ['ipfs://bafybeicn7i3soqiwhzzrtomxcysuxqg3ahtx2mdj3lyg57hsswxdcd2xca/metadata.json'],
      })
      // Wait a moment then refetch to update UI
      setTimeout(() => refetchTokenId(), 3000)
    } catch (e) {
      console.error('Failed to mint garden:', e)
    } finally {
      setIsMinting(false)
    }
  }
  
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
    <div className="space-y-8">
      {/* NFT Status Section */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {hasGarden ? '🌱 Your Garden is Alive On-Chain' : '🥀 Claim Your Plot'}
          </h2>
          <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
            {hasGarden 
              ? `Your Bloomora Garden NFT (Token ID: ${tokenId?.toString()}) tracks your deposit and harvest history across YO vaults.`
              : 'Mint your free Bloomora Garden NFT to start tracking your visual yield progression on Base network.'}
          </p>
        </div>
        
        {!hasGarden && (
          <button
            onClick={handleMintGarden}
            disabled={isMinting || !BLOOMORA_GARDEN_ADDRESS[PRIMARY_CHAIN_ID]}
            className="shrink-0 bg-garden-accent hover:bg-garden-accent-light text-black font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isMinting ? <Loader2 className="w-5 h-5 animate-spin" /> : '🎫 Mint Garden Plot'}
          </button>
        )}
      </div>

      {/* Garden Cooperatives (Savings Groups) */}
      <GardenCooperative />

      {/* Vault Grid */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">🌿 Available Vaults</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaults?.map((vault) => (
            <VaultCard key={vault.contracts.vaultAddress} vault={vault} />
          ))}
        </div>
      </div>

      <DepositWizard />
      <RedeemWizard />
    </div>
  )
}

