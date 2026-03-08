import type { WeatherState, PlantDNA } from '../PlantDNA'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const MAX_PARTICLES = 80
let particles: Particle[] = []

export function updateAndDrawWeather(
  ctx: CanvasRenderingContext2D,
  weather: WeatherState,
  width: number,
  height: number,
  delta: number,
) {
  spawnWeatherParticles(weather, width, height)
  updateParticles(delta)
  renderParticles(ctx)
}

function spawnWeatherParticles(weather: WeatherState, width: number, height: number) {
  if (particles.length >= MAX_PARTICLES) return

  switch (weather) {
    case 'rainy':
      if (Math.random() < 0.3) {
        particles.push({
          x: Math.random() * width,
          y: -5,
          vx: -0.5,
          vy: 4 + Math.random() * 2,
          life: 1,
          maxLife: 1,
          size: 1.5,
          color: 'rgba(120, 160, 220, 0.4)',
        })
      }
      break
    case 'stormy':
      if (Math.random() < 0.5) {
        particles.push({
          x: Math.random() * width,
          y: -5,
          vx: -2 + Math.random() * -2,
          vy: 6 + Math.random() * 3,
          life: 1,
          maxLife: 1,
          size: 2,
          color: 'rgba(160, 180, 220, 0.5)',
        })
      }
      break
    case 'golden_hour':
      if (Math.random() < 0.05) {
        particles.push({
          x: Math.random() * width,
          y: height * 0.7 + Math.random() * height * 0.2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.3 - Math.random() * 0.5,
          life: 1,
          maxLife: 1,
          size: 2,
          color: 'rgba(255, 215, 100, 0.6)',
        })
      }
      break
    default:
      break
  }
}

function updateParticles(delta: number) {
  const dt = delta / 16
  particles = particles.filter((p) => {
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.life -= 0.008 * dt
    return p.life > 0
  })
}

function renderParticles(ctx: CanvasRenderingContext2D) {
  for (const p of particles) {
    ctx.globalAlpha = p.life
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

/** Yield sparkles floating up from plants. */
export function drawYieldSparkles(
  ctx: CanvasRenderingContext2D,
  plants: PlantDNA[],
  canvasWidth: number,
  canvasHeight: number,
  timestamp: number,
) {
  for (const plant of plants) {
    if (plant.maturity < 0.1) continue

    const px = plant.position.x * canvasWidth
    const py = plant.position.y * canvasHeight
    const count = Math.floor(plant.maturity * 3)

    for (let i = 0; i < count; i++) {
      const phase = timestamp / 2000 + i * 2.1 + plant.position.x * 5
      const sparkleY = py - 20 - (phase % 1) * 40
      const sparkleX = px + Math.sin(phase * 3) * 8
      const alpha = 0.3 + Math.sin(phase * 5) * 0.2

      ctx.globalAlpha = Math.max(0, alpha)
      ctx.fillStyle = `hsla(${plant.color.h}, 80%, 75%, 1)`
      ctx.beginPath()
      ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}
