import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DashboardImage {
  id: string
  src: string
  title: string
  description: string
  color: string
}

export const Kaleidoscope = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Изображения для калейдоскопа
  const images: DashboardImage[] = [
    {
      id: '1',
      src: '/src/assets/images/analytics-meetings.jpg',
      title: 'Статистика встреч',
      description: 'Детальная статистика по встречам',
      color: 'from-primary-400 to-primary-600'
    },
    
    {
      id: '2',
      src: '/src/assets/images/task-planner.jpg',
      title: 'Планировщик задач',
      description: 'Создание и отслеживание задач',
      color: 'from-secondary-400 to-secondary-600'
    },
    {
      id: '3',
      src: '/src/assets/images/route-map.jpg',
      title: 'Карта маршрутов',
      description: 'Оптимизация маршрутов встреч',
      color: 'from-primary-300 to-accent-500'
    },
    
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlaying(false)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Основное изображение */}
      <div className="relative w-full h-full">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${images[currentIndex].color} transition-all duration-1000 ease-in-out`}
          style={{
            transform: `scale(${isAutoPlaying ? 1.05 : 1})`,
            filter: 'blur(0px)',
          }}
        >
          {/* Изображение */}
          <div className="absolute inset-0">
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{images[currentIndex].title}</h3>
                <p className="text-lg opacity-90">{images[currentIndex].description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Эффект калейдоскопа - отражения */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/20 to-transparent"
            style={{
              transform: 'scaleX(-1) scaleY(-1)',
              animation: 'float 4s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/20 to-transparent"
            style={{
              transform: 'scaleX(-1)',
              animation: 'float 4s ease-in-out infinite 1s',
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-white/20 to-transparent"
            style={{
              transform: 'scaleY(-1)',
              animation: 'float 4s ease-in-out infinite 2s',
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-white/20 to-transparent"
            style={{
              animation: 'float 4s ease-in-out infinite 3s',
            }}
          />
        </div>
      </div>

      {/* Навигационные кнопки */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Индикаторы */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Автоплей кнопка */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
      >
        <div className={`w-4 h-4 ${isAutoPlaying ? 'bg-white' : 'bg-white/50'}`} />
      </button>
    </div>
  )
}
