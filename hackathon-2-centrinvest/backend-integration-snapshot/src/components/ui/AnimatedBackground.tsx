import { useState, useEffect, useRef } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  animationDelay: number
  baseX: number
  baseY: number
}

export const AnimatedBackground = () => {
  const [stars, setStars] = useState<Star[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Создаем звезды при монтировании
    const generateStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < 30; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.3,
          animationDelay: Math.random() * 3,
          baseX: Math.random() * 100,
          baseY: Math.random() * 100,
        })
      }
      setStars(newStars)
    }

    generateStars()

    // Обработчик движения мыши
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        background: `linear-gradient(135deg, #FFF001 0%, #3CC730 100%)`,
        backgroundSize: '200% 200%',
        animation: 'gradient 20s ease infinite',
      }}
    >
      {/* Большой полупрозрачный символ % */}
      <div 
        className="absolute text-white/15 font-bold select-none"
        style={{
          fontSize: '15rem',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          animation: 'float 8s ease-in-out infinite',
        }}
      >
        %
      </div>

      {/* Анимированные звезды с отталкиванием от курсора */}
      {stars.map((star) => {
        // Вычисляем расстояние от курсора до звезды
        const dx = mousePosition.x * 100 - star.baseX
        const dy = mousePosition.y * 100 - star.baseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Отталкивание от курсора (чем ближе курсор, тем дальше звезда)
        const repelStrength = Math.max(0, 40 - distance) / 40
        const repelX = dx / Math.max(distance, 1) * repelStrength * 15
        const repelY = dy / Math.max(distance, 1) * repelStrength * 15
        
        const finalX = star.baseX + repelX
        const finalY = star.baseY + repelY

        return (
          <div
            key={star.id}
            className="absolute text-white/70 font-bold select-none"
            style={{
              left: `${Math.max(0, Math.min(100, finalX))}%`,
              top: `${Math.max(0, Math.min(100, finalY))}%`,
              fontSize: `${star.size}rem`,
              opacity: star.opacity,
              animation: `float 8s ease-in-out infinite`,
              animationDelay: `${star.animationDelay}s`,
              transition: 'all 1.2s ease-out',
              zIndex: 2,
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}
          >
            %
          </div>
        )
      })}

      {/* Дополнительные мелкие символы */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`small-${i}`}
          className="absolute text-white/25 font-bold select-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 1 + 0.5}rem`,
            opacity: Math.random() * 0.4 + 0.2,
            animation: `float ${Math.random() * 3 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            transition: 'all 0.6s ease-out',
            zIndex: 1,
          }}
        >
          %
        </div>
      ))}
    </div>
  )
}
