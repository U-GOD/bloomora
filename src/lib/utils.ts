import { formatUnits } from 'viem'

/**
 * Format a token amount with proper decimals
 */
export function formatAmount(value: bigint, decimals: number, maxDecimals = 4): string {
  const formatted = formatUnits(value, decimals)
  const num = parseFloat(formatted)

  if (num === 0) return '0'
  if (num < 0.0001) return '<0.0001'

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  })
}

/**
 * Format a USD value
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Shorten an Ethereum address
 */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format APY percentage
 */
export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`
}

/**
 * Calculate time elapsed in human-readable format
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
