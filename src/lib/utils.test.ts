import { describe, it, expect } from 'vitest'
import { formatAmount, formatUSD, shortenAddress, formatAPY, timeAgo } from './utils'

describe('formatAmount', () => {
  it('returns "0" for zero value', () => {
    expect(formatAmount(0n, 18)).toBe('0')
  })

  it('formats a typical token amount', () => {
    // 100.5 USDC (6 decimals) = 100500000n
    const result = formatAmount(100_500_000n, 6)
    expect(result).toContain('100.5')
  })

  it('returns "<0.0001" for very small amounts', () => {
    expect(formatAmount(1n, 18)).toBe('<0.0001')
  })
})

describe('formatUSD', () => {
  it('formats a standard USD value', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56')
  })

  it('handles zero', () => {
    expect(formatUSD(0)).toBe('$0.00')
  })
})

describe('shortenAddress', () => {
  it('shortens a full Ethereum address', () => {
    const addr = '0x1234567890abcdef1234567890abcdef12345678'
    expect(shortenAddress(addr)).toBe('0x1234...5678')
  })

  it('supports custom char count', () => {
    const addr = '0x1234567890abcdef1234567890abcdef12345678'
    expect(shortenAddress(addr, 6)).toBe('0x123456...345678')
  })
})

describe('formatAPY', () => {
  it('formats a percentage with 2 decimal places', () => {
    expect(formatAPY(5.123)).toBe('5.12%')
  })

  it('handles zero', () => {
    expect(formatAPY(0)).toBe('0.00%')
  })
})

describe('timeAgo', () => {
  it('returns "just now" for recent timestamps', () => {
    const now = Math.floor(Date.now() / 1000) - 10
    expect(timeAgo(now)).toBe('just now')
  })

  it('returns minutes ago', () => {
    const fiveMinAgo = Math.floor(Date.now() / 1000) - 300
    expect(timeAgo(fiveMinAgo)).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const twoHoursAgo = Math.floor(Date.now() / 1000) - 7200
    expect(timeAgo(twoHoursAgo)).toBe('2h ago')
  })

  it('returns days ago', () => {
    const threeDaysAgo = Math.floor(Date.now() / 1000) - 259200
    expect(timeAgo(threeDaysAgo)).toBe('3d ago')
  })
})
