import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useVaults } from '@yo-protocol/react'
import { useCoopStore } from '@/stores/useCoopStore'
import { Users, Link, LogOut, Plus, Copy, Check } from 'lucide-react'

export function GardenCooperative() {
  const { address } = useAccount()
  const { vaults } = useVaults()
  const { coopName, coopId, members, createCoop, joinCoop, leaveCoop, getInviteLink } =
    useCoopStore()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCoopName, setNewCoopName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Auto-join via URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const coopParam = params.get('coop')
    if (coopParam && address && !coopId) {
      joinCoop(coopParam, address)
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [address, coopId, joinCoop])

  // Calculate combined TVL from all vaults
  const combinedTVL = vaults?.reduce((sum, v) => {
    return sum + (v.tvl?.formatted ? Number(v.tvl.formatted) : 0)
  }, 0) ?? 0

  // Estimated combined yield (simplified: TVL * avg APY / 365 * members)
  const avgAPY = vaults?.length
    ? vaults.reduce((sum, v) => sum + (v.yield?.['7d'] ? Number(v.yield['7d']) : 0), 0) / vaults.length
    : 0

  const dailyYield = (combinedTVL * avgAPY) / 100 / 365

  const handleCreate = () => {
    if (!address || !newCoopName.trim()) return
    createCoop(newCoopName.trim(), address)
    setShowCreateModal(false)
    setNewCoopName('')
  }

  const handleJoin = () => {
    if (!address || !joinCode.trim()) return
    joinCoop(joinCode.trim().toUpperCase(), address)
    setJoinCode('')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getInviteLink())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Not in a co-op ────────────────────────────────────
  if (!coopId) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-garden-accent" />
          <h3 className="text-lg font-bold text-text-primary">Garden Cooperatives</h3>
        </div>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          Team up with friends! Pool your progress, share stats, and climb the ranks together.
        </p>

        {showCreateModal ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name your co-op (e.g. Yield Farmers Alpha)"
              value={newCoopName}
              onChange={(e) => setNewCoopName(e.target.value)}
              maxLength={30}
              className="w-full bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-garden-accent/50 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newCoopName.trim()}
                className="flex-1 btn-primary text-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Plus size={14} /> Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-text-secondary border border-garden-accent/10 hover:bg-garden-surface-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full btn-primary text-sm flex items-center justify-center gap-1.5"
            >
              <Plus size={14} /> Create a Co-op
            </button>

            <div className="flex items-center gap-2 text-text-muted text-xs">
              <div className="flex-1 h-px bg-garden-accent/10" />
              <span>or join one</span>
              <div className="flex-1 h-px bg-garden-accent/10" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                maxLength={6}
                className="flex-1 bg-garden-surface border border-garden-accent/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-garden-accent/50 transition-colors uppercase tracking-widest text-center font-mono"
              />
              <button
                onClick={handleJoin}
                disabled={joinCode.length < 4}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-garden-surface-hover text-garden-accent border border-garden-accent/20 hover:bg-garden-accent/10 transition-colors disabled:opacity-40"
              >
                Join
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Inside a co-op ────────────────────────────────────
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-garden-accent" />
          <h3 className="text-lg font-bold text-text-primary">{coopName || `Co-op ${coopId}`}</h3>
        </div>
        <span className="text-xs font-mono text-text-muted bg-garden-surface px-2 py-1 rounded-full border border-garden-accent/10">
          #{coopId}
        </span>
      </div>

      {/* Combined Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-garden-surface-hover/50 rounded-lg p-3 text-center border border-garden-accent/5">
          <p className="text-xs text-text-muted mb-1">Members</p>
          <p className="text-xl font-bold text-garden-accent">{members.length}</p>
        </div>
        <div className="bg-garden-surface-hover/50 rounded-lg p-3 text-center border border-garden-accent/5">
          <p className="text-xs text-text-muted mb-1">Pool TVL</p>
          <p className="text-xl font-bold text-text-primary">
            ${combinedTVL >= 1000 ? `${(combinedTVL / 1000).toFixed(1)}K` : combinedTVL.toFixed(0)}
          </p>
        </div>
        <div className="bg-garden-surface-hover/50 rounded-lg p-3 text-center border border-garden-accent/5">
          <p className="text-xs text-text-muted mb-1">Daily Yield</p>
          <p className="text-xl font-bold text-garden-gold">
            ${dailyYield.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Member List */}
      <div className="mb-4">
        <p className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wide">Gardeners</p>
        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
          {members.map((m, i) => (
            <div
              key={m.address}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-garden-surface/50 border border-garden-accent/5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{i === 0 ? '👑' : '🌱'}</span>
                <span className="text-sm text-text-primary font-mono">{m.displayName}</span>
              </div>
              {i === 0 && (
                <span className="text-[10px] text-garden-gold font-bold uppercase">Founder</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-garden-accent/10 text-garden-accent border border-garden-accent/20 hover:bg-garden-accent/20 transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Invite Link'}
        </button>
        <button
          onClick={leaveCoop}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-garden-danger/70 border border-garden-danger/10 hover:bg-garden-danger/10 transition-colors"
        >
          <LogOut size={14} />
          Leave
        </button>
      </div>
    </div>
  )
}
