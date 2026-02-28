import { useState, useEffect } from 'react'
import { MASCOT_OPTIONS } from './MascotPicker'

interface AnimatedMascotProps {
  mascotId: string
  customImageUrl?: string
}

export function AnimatedMascot({
  mascotId,
  customImageUrl,
}: AnimatedMascotProps) {
  const [posX, setPosX] = useState(20)
  const [direction, setDirection] = useState<'right' | 'left'>('right')
  const [bounce, setBounce] = useState(false)

  const mascot = MASCOT_OPTIONS.find((m) => m.id === mascotId)
  const isCustom = mascotId === 'custom'

  useEffect(() => {
    const interval = setInterval(() => {
      setPosX((prev) => {
        if (direction === 'right') {
          if (prev >= 80) {
            setDirection('left')
            return prev - 2
          }
          return prev + 2
        } else {
          if (prev <= 10) {
            setDirection('right')
            return prev + 2
          }
          return prev - 2
        }
      })
    }, 150)

    return () => clearInterval(interval)
  }, [direction])

  // Bounce animation
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(true)
      setTimeout(() => setBounce(false), 400)
    }, 2000)
    return () => clearInterval(bounceInterval)
  }, [])

  if (!mascot && !isCustom) return null

  return (
    <div className="relative w-full h-16 overflow-hidden pointer-events-none select-none">
      <div
        className="absolute bottom-1 transition-all duration-150 ease-linear"
        style={{
          left: `${posX}%`,
          transform: `scaleX(${direction === 'left' ? -1 : 1}) ${bounce ? 'translateY(-8px)' : 'translateY(0)'}`,
        }}
      >
        {isCustom && customImageUrl ? (
          <img
            src={customImageUrl}
            alt="Mascota"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
        ) : mascot ? (
          <span
            className={`material-symbols-outlined text-4xl ${mascot.color} drop-shadow-md`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {mascot.icon}
          </span>
        ) : null}
      </div>
      {/* Floor line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-slate-200" />
    </div>
  )
}
