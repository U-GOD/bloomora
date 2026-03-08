import type { PlantDNA } from '../PlantDNA'

/** Renders a plant on canvas based on its DNA and maturity. */
export function drawPlant(
  ctx: CanvasRenderingContext2D,
  plant: PlantDNA,
  canvasWidth: number,
  canvasHeight: number,
  timestamp: number,
) {
  const x = plant.position.x * canvasWidth
  const y = plant.position.y * canvasHeight
  const scale = 0.5 + plant.maturity * 1.5
  const sway = Math.sin(timestamp / 1500 + plant.position.x * 10) * 2 * (1 - plant.maturity * 0.3)

  ctx.save()
  ctx.translate(x + sway, y)

  switch (plant.species) {
    case 'lavender':
      drawLavender(ctx, scale, plant)
      break
    case 'oak_tree':
      drawOakTree(ctx, scale, plant)
      break
    case 'vine':
      drawVine(ctx, scale, plant, timestamp)
      break
    case 'tulip':
      drawTulip(ctx, scale, plant)
      break
    case 'sunflower':
      drawSunflower(ctx, scale, plant, timestamp)
      break
  }

  // Mutation glow
  if (plant.mutations.includes('legendary_glow')) {
    ctx.globalAlpha = 0.15 + Math.sin(timestamp / 500) * 0.1
    ctx.shadowColor = hsl(plant.color)
    ctx.shadowBlur = 30
    ctx.beginPath()
    ctx.arc(0, -20 * scale, 15 * scale, 0, Math.PI * 2)
    ctx.fillStyle = hsl(plant.color)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  ctx.restore()
}

function hsl(c: { h: number; s: number; l: number }, alpha = 1): string {
  return `hsla(${c.h}, ${c.s}%, ${c.l}%, ${alpha})`
}

// ── Species Renderers ────────────────────────────────────────────

function drawStem(ctx: CanvasRenderingContext2D, height: number, width: number) {
  ctx.strokeStyle = '#2d5a3d'
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, -height)
  ctx.stroke()
}

function drawLavender(ctx: CanvasRenderingContext2D, scale: number, plant: PlantDNA) {
  const stemH = 35 * scale
  drawStem(ctx, stemH, 2 * scale)

  const bloomCount = plant.maturity > 0.25 ? Math.floor(3 + plant.maturity * 5) : 1
  for (let i = 0; i < bloomCount; i++) {
    const bx = (i - bloomCount / 2) * 4 * scale
    const by = -stemH + i * 2 * scale - 5 * scale
    ctx.beginPath()
    ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2)
    ctx.fillStyle = hsl(plant.color, 0.7 + plant.maturity * 0.3)
    ctx.fill()
  }
}

function drawOakTree(ctx: CanvasRenderingContext2D, scale: number, plant: PlantDNA) {
  const trunkH = 50 * scale
  ctx.fillStyle = '#4a3728'
  ctx.fillRect(-3 * scale, 0, 6 * scale, -trunkH)

  // Canopy
  const canopyR = (15 + plant.maturity * 20) * scale
  const hasFull = plant.mutations.includes('full_canopy')
  const layers = hasFull ? 3 : 2

  for (let i = 0; i < layers; i++) {
    const offsetX = (i - 1) * canopyR * 0.4
    const offsetY = -trunkH - canopyR * 0.3 - i * 5 * scale
    ctx.beginPath()
    ctx.arc(offsetX, offsetY, canopyR * (1 - i * 0.15), 0, Math.PI * 2)
    ctx.fillStyle = hsl({ ...plant.color, l: plant.color.l - i * 5 }, 0.6 + plant.maturity * 0.3)
    ctx.fill()
  }
}

function drawVine(ctx: CanvasRenderingContext2D, scale: number, plant: PlantDNA, timestamp: number) {
  const segments = 4 + Math.floor(plant.maturity * 6)
  ctx.strokeStyle = hsl({ ...plant.color, l: 35 })
  ctx.lineWidth = 2 * scale
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 0)

  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    const wiggle = Math.sin(timestamp / 2000 + i * 1.5) * 8 * scale
    ctx.lineTo(wiggle, -t * 60 * scale)
  }
  ctx.stroke()

  // Leaves
  if (plant.maturity > 0.2) {
    for (let i = 1; i < segments; i += 2) {
      const t = i / segments
      const lx = Math.sin(timestamp / 2000 + i * 1.5) * 8 * scale
      const ly = -t * 60 * scale
      ctx.beginPath()
      ctx.ellipse(lx + 6 * scale, ly, 5 * scale, 3 * scale, 0.3, 0, Math.PI * 2)
      ctx.fillStyle = hsl(plant.color, 0.5 + plant.maturity * 0.4)
      ctx.fill()
    }
  }
}

function drawTulip(ctx: CanvasRenderingContext2D, scale: number, plant: PlantDNA) {
  const count = plant.maturity > 0.5 ? 3 : plant.maturity > 0.1 ? 2 : 1
  for (let i = 0; i < count; i++) {
    const ox = (i - (count - 1) / 2) * 12 * scale
    ctx.save()
    ctx.translate(ox, 0)

    const stemH = 30 * scale
    drawStem(ctx, stemH, 1.5 * scale)

    // Cup-shaped petal
    ctx.beginPath()
    ctx.moveTo(-5 * scale, -stemH)
    ctx.quadraticCurveTo(-7 * scale, -stemH - 12 * scale, 0, -stemH - 15 * scale)
    ctx.quadraticCurveTo(7 * scale, -stemH - 12 * scale, 5 * scale, -stemH)
    ctx.closePath()
    ctx.fillStyle = hsl(plant.color, 0.7 + plant.maturity * 0.3)
    ctx.fill()

    ctx.restore()
  }
}

function drawSunflower(ctx: CanvasRenderingContext2D, scale: number, plant: PlantDNA, timestamp: number) {
  const stemH = 55 * scale
  drawStem(ctx, stemH, 3 * scale)

  // Head rotation tracking a virtual sun
  const sunAngle = Math.sin(timestamp / 4000) * 0.2
  ctx.save()
  ctx.translate(0, -stemH)
  ctx.rotate(sunAngle)

  // Petals
  const petalCount = 10 + Math.floor(plant.maturity * 6)
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2
    ctx.save()
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.ellipse(0, -12 * scale, 3 * scale, 10 * scale, 0, 0, Math.PI * 2)
    ctx.fillStyle = hsl(plant.color, 0.7 + plant.maturity * 0.3)
    ctx.fill()
    ctx.restore()
  }

  // Center disk
  ctx.beginPath()
  ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2)
  ctx.fillStyle = '#5c3a1e'
  ctx.fill()

  ctx.restore()
}
