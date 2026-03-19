import type { WeatherState, Season } from '../PlantDNA'

const SKY_GRADIENTS: Record<WeatherState, [string, string]> = {
  golden_hour: ['#2E1065', '#9D174D'], // Rich purple to deep pink
  sunny:       ['#0F172A', '#312E81'], // Slate to Deep sapphire blue
  rainy:       ['#0F172A', '#1E293B'], // Muted slate
  stormy:      ['#020617', '#111827'], // Near black to dark gray
}

export function drawSky(
  ctx: CanvasRenderingContext2D,
  weather: WeatherState,
  _season: Season,
  width: number,
  height: number,
) {
  const [top, bottom] = SKY_GRADIENTS[weather]
  const grad = ctx.createLinearGradient(0, 0, 0, height)
  grad.addColorStop(0, top)
  grad.addColorStop(1, bottom)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  if (weather === 'golden_hour' || weather === 'sunny') {
    drawStars(ctx, width, height, weather === 'golden_hour' ? 60 : 30)
  }
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  // Deterministic star positions using a simple seeded pattern
  for (let i = 0; i < count; i++) {
    const x = ((i * 997) % width)
    const y = ((i * 631) % (height * 0.6))
    const r = (i % 3 === 0) ? 1.5 : 0.8
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
  _season: Season,
  width: number,
  height: number,
) {
  const groundY = height * 0.65
  const grad = ctx.createLinearGradient(0, groundY, 0, height)
  grad.addColorStop(0, '#064E3B') // Emerald dark
  grad.addColorStop(0.5, '#022C22') // Very dark green
  grad.addColorStop(1, '#020617')   // Slate black
  ctx.fillStyle = grad
  ctx.fillRect(0, groundY, width, height - groundY)

  // Glowing horizon line
  ctx.strokeStyle = 'rgba(110, 231, 183, 0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(width, groundY)
  ctx.stroke()

  // Magical soil spores / distant grass
  ctx.fillStyle = 'rgba(110, 231, 183, 0.15)'
  for (let i = 0; i < 60; i++) {
    const x = ((i * 733) % width)
    const y = groundY + ((i * 421) % (height - groundY))
    ctx.beginPath()
    ctx.arc(x, y, (i % 3) + 1, 0, Math.PI * 2)
    ctx.fill()
  }
}
