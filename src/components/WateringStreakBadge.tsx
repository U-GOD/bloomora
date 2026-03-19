import { useStreakStore } from '@/stores/useStreakStore'
import { Droplet } from 'lucide-react'

export function WateringStreakBadge() {
  const { currentStreak, lastWateredDate, waterGarden } = useStreakStore()
  
  const today = new Date().toISOString().split('T')[0]
  const isWateredToday = lastWateredDate === today

  return (
    <div className="flex items-center gap-3">
      {currentStreak > 0 && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-sm">
          🔥 {currentStreak} Day{currentStreak === 1 ? '' : 's'}
        </div>
      )}
      
      <button
        onClick={waterGarden}
        disabled={isWateredToday}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
          isWateredToday 
            ? 'bg-garden-surface text-garden-accent/50 cursor-not-allowed border border-garden-accent/10'
            : 'bg-garden-accent text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(110,231,183,0.3)]'
        }`}
      >
        <Droplet size={16} className={!isWateredToday ? 'animate-bounce' : ''} />
        {isWateredToday ? 'Watered Today' : 'Water Garden'}
      </button>
    </div>
  )
}
