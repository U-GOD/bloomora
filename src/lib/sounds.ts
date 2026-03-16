// A zero-dependency sound synthesizer using the native Web Audio API
// This avoids needing external MP3 assets and guarantees immediate playback.

let audioCtx: AudioContext | null = null

function initAudio() {
  if (typeof window !== 'undefined' && !audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx?.state === 'suspended') {
    audioCtx.resume()
  }
}

export function playSound(type: 'plant' | 'harvest' | 'bloom') {
  try {
    initAudio()
    if (!audioCtx) return

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    const now = audioCtx.currentTime

    if (type === 'plant') {
      // Low "thud" for planting in dirt
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(150, now)
      oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.1)
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(1, now + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
      
      oscillator.start(now)
      oscillator.stop(now + 0.2)
    } else if (type === 'harvest') {
      // Bright "ding" / chime for harvesting gold
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(880, now) // A5
      oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.1) // Up to A6
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
      
      oscillator.start(now)
      oscillator.stop(now + 0.7)
    } else if (type === 'bloom') {
      // Soft twinkle
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(1046.50, now) // C6
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      
      oscillator.start(now)
      oscillator.stop(now + 0.4)
    }
  } catch (e) {
    console.warn('Audio playback failed (likely due to browser auto-play policy):', e)
  }
}
