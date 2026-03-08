import { useRef, useEffect, useCallback } from 'react'
import { useGardenStore } from '@/stores/useGardenStore'
import { drawSky, drawGround } from './renderers/environment'
import { drawPlant } from './renderers/plants'
import { updateAndDrawWeather, drawYieldSparkles } from './renderers/particles'

export function GardenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef(0)

  const plants = useGardenStore((s) => s.plants)
  const weather = useGardenStore((s) => s.weather)
  const season = useGardenStore((s) => s.season)

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
  }, [])

  useEffect(() => {
    resizeCanvas()

    const handleResize = () => resizeCanvas()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [resizeCanvas])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!

    function gameLoop(timestamp: number) {
      const delta = timestamp - lastTimeRef.current
      if (delta < 16.67) {
        rafRef.current = requestAnimationFrame(gameLoop)
        return
      }
      lastTimeRef.current = timestamp

      const dpr = window.devicePixelRatio || 1
      const w = canvas!.width / dpr
      const h = canvas!.height / dpr

      ctx.clearRect(0, 0, w, h)

      drawSky(ctx, weather, season, w, h)
      drawGround(ctx, season, w, h)

      // Sort plants back-to-front by y position
      const sorted = [...plants].sort((a, b) => a.position.y - b.position.y)
      for (const plant of sorted) {
        drawPlant(ctx, plant, w, h, timestamp)
      }

      updateAndDrawWeather(ctx, weather, w, h, delta)
      drawYieldSparkles(ctx, plants, w, h, timestamp)

      rafRef.current = requestAnimationFrame(gameLoop)
    }

    rafRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [plants, weather, season])

  const plantCount = plants.length

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-garden-accent/10">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: '360px' }}
      />
      {plantCount === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-text-muted text-sm opacity-60">
            Deposit into a vault to plant your first seed
          </p>
        </div>
      )}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[10px] text-text-muted font-mono opacity-40">
        <span>{plantCount} plant{plantCount !== 1 && 's'}</span>
        <span>·</span>
        <span>{weather}</span>
      </div>
    </div>
  )
}
