import type { WeatherState, Season } from '../PlantDNA'

const SKY_GRADIENTS: Record<WeatherState, [string, string]> = {
  golden_hour: ['#1a0a2e', '#2d1b4e'],
  sunny:       ['#0a0f1a', '#1a1f3a'],
  rainy:       ['#0d0d1a', '#1a1a2e'],
  stormy:      ['#080808', '#121218'],
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
    drawStars(ctx, width, height, weather === 'golden_hour' ? 40 : 20)
  }
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  // Deterministic star positions using a simple seeded pattern
  for (let i = 0; i < count; i++) {
    const x = ((i * 997) % width)
    const y = ((i * 631) % (height * 0.5))
    const r = (i % 3 === 0) ? 1.5 : 1
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
  grad.addColorStop(0, '#0d2818')
  grad.addColorStop(0.4, '#0a1f14')
  grad.addColorStop(1, '#061210')
  ctx.fillStyle = grad
  ctx.fillRect(0, groundY, width, height - groundY)

  // Soil horizon line
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(width, groundY)
  ctx.stroke()
}
