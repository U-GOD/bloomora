import { ShieldAlert } from 'lucide-react'

export function RiskDisclosure() {
  return (
    <div className="bg-garden-surface-hover/30 border border-garden-danger/20 rounded-2xl p-6 mt-8">
      <div className="flex items-start gap-4">
        <div className="bg-garden-danger/10 p-2 rounded-lg shrink-0 mt-1">
          <ShieldAlert className="w-5 h-5 text-garden-danger" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary mb-2">
            Experimental Software & Protocol Risk
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed space-y-2">
            <span className="block mb-2">
              Bloomora is a hackathon project providing a gamified interface for the YO Protocol. It is experimental software provided "as-is" without any warranties.
            </span>
            <span className="block mb-2">
              By depositing funds, you are interacting directly with YO Protocol's smart contracts via the ERC-4626 standard. Your funds are entirely self-custodied in the underlying vaults, but you assume all smart contract risks associated with YO Protocol and Base network.
            </span>
            <span className="block text-garden-danger/80 font-medium">
              Never deposit funds you cannot afford to lose. The garden yields are dynamic and can fall rapidly based on market conditions.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
