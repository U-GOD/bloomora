---
name: procedural-garden
description: >-
  Use this skill when implementing the Bloomora procedural garden engine: plant DNA system,
  growth algorithms, Canvas 2D rendering, weather effects, particle systems, and vault-to-plant
  mappings. Covers the genetics-based growth model, mutation thresholds, species rendering,
  and animation timing.
author: bloomora-team
---

# Procedural Garden Engine

## Plant DNA System

Every deposit creates a plant with DNA derived from vault type, deposit amount, and yield metrics.

```typescript
interface PlantDNA {
  id: string                    // Unique plant ID
  species: PlantSpecies         // Derived from vault
  vaultAddress: `0x${string}`
  vaultName: string             // 'yoUSD' | 'yoETH' | 'yoBTC' | 'yoEUR' | 'yoGOLD'
  depositAmount: string         // Human-readable (e.g., "100.5")
  depositTimestamp: number      // Unix seconds
  growthRate: number            // Current APY / 365 / 100
  maturity: number              // 0.0 → 1.0
  health: number                // 0.0 → 1.0
  mutations: PlantMutation[]    // Visual traits unlocked over time
  color: { h: number; s: number; l: number }
  position: { x: number; y: number }  // Canvas position (0-1 normalized)
}

type PlantSpecies = 'lavender' | 'oak_tree' | 'vine' | 'tulip' | 'sunflower'
type PlantMutation = 'first_bloom' | 'full_canopy' | 'fruit_bearing' | 'legendary_glow' | 'crystal_petals'
```

## Vault → Species Mapping

| Vault   | Species      | Visual Description                              | Risk  |
|---------|-------------|------------------------------------------------|-------|
| yoUSD   | lavender    | Calm purple bush, symmetrical, gentle sway     | Low   |
| yoETH   | oak_tree    | Strong trunk, spreading canopy, birds nest     | Med   |
| yoBTC   | vine        | Climbing golden vine, unpredictable direction  | High  |
| yoEUR   | tulip       | Neat rows of tulips, orderly cluster blooms    | Low   |
| yoGOLD  | sunflower   | Tall stem, large golden head, tracks "sun"     | Med   |

## Growth Algorithm

```typescript
function sigmoidDerivative(x: number): number {
  const s = 1 / (1 + Math.exp(-10 * (x - 0.5)))
  return s * (1 - s) * 4  // Peak growth at maturity 0.5
}

function updatePlantGrowth(plant: PlantDNA, currentAPY: number, deltaSec: number): PlantDNA {
  const baseGrowthPerDay = currentAPY / 365 / 100
  const growthIncrement = baseGrowthPerDay * (deltaSec / 86400)
  const newMaturity = Math.min(1.0, plant.maturity + growthIncrement * sigmoidDerivative(plant.maturity))

  const newMutations = [...plant.mutations]
  if (newMaturity > 0.25 && !newMutations.includes('first_bloom')) newMutations.push('first_bloom')
  if (newMaturity > 0.50 && !newMutations.includes('full_canopy')) newMutations.push('full_canopy')
  if (newMaturity > 0.75 && !newMutations.includes('fruit_bearing')) newMutations.push('fruit_bearing')
  if (newMaturity > 0.95 && !newMutations.includes('legendary_glow')) newMutations.push('legendary_glow')

  return { ...plant, maturity: newMaturity, mutations: newMutations, growthRate: currentAPY }
}
```

## Canvas Render Loop

```typescript
// 60fps target, throttle to 30fps on mobile
let lastTime = 0
function gameLoop(timestamp: number) {
  const delta = timestamp - lastTime
  if (delta < 16.67) { requestAnimationFrame(gameLoop); return } // Cap at 60fps
  lastTime = timestamp

  // 1. Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 2. Draw sky gradient (time-of-day + weather)
  drawSky(ctx, gardenState.weather, Date.now())

  // 3. Draw ground/soil
  drawGround(ctx, gardenState.season)

  // 4. Draw plants back-to-front (sorted by y position)
  const sorted = [...gardenState.plants].sort((a, b) => a.position.y - b.position.y)
  for (const plant of sorted) {
    drawPlant(ctx, plant, timestamp)
  }

  // 5. Draw weather particles
  drawWeatherParticles(ctx, gardenState.weather, delta)

  // 6. Draw yield sparkles
  drawYieldSparkles(ctx, gardenState.plants, timestamp)

  requestAnimationFrame(gameLoop)
}
```

## Weather Mapping

```typescript
function getWeather(apyData: number[], tvlData: number[]): WeatherState {
  const apyVolatility = calculateVolatility(apyData.slice(-7))
  const tvlTrend = (tvlData[tvlData.length - 1] - tvlData[tvlData.length - 8]) / tvlData[tvlData.length - 8]

  if (apyVolatility < 0.05 && tvlTrend > 0.01) return 'golden_hour'
  if (apyVolatility < 0.15) return 'sunny'
  if (apyVolatility < 0.35) return 'rainy'
  return 'stormy'
}
```

## Canvas Responsiveness

```typescript
function resizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
}
// Call on mount + window resize (debounced)
```

## Animation Triggers

| Event                  | Animation                                        |
|------------------------|--------------------------------------------------|
| Deposit confirmed      | Seed planting burst → sprout emerges from soil    |
| Yield accruing (poll)  | Tiny sparkle particles float up from plants       |
| APY increase           | Golden sunshine rays, flowers bloom wider          |
| APY drop > 20%         | Rain clouds, plants droop slightly                |
| Redeem (harvest)       | Golden particles, plant shrinks gracefully         |
| Cross-pollination      | Butterflies fly between gardens, hybrid bud        |
