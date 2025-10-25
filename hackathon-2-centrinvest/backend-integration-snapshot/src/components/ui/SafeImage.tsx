import { useState, ReactNode } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  fallback?: ReactNode
  className?: string
  onError?: () => void
}

export const SafeImage = ({ 
  src, 
  alt, 
  fallback, 
  className = '', 
  onError 
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-secondary-100 rounded-lg ${className}`}>
        {fallback || (
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-sm text-text-secondary">Изображение недоступно</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}
