import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface SafeIconProps {
  icon?: LucideIcon
  fallback?: ReactNode
  className?: string
  size?: number
}

export const SafeIcon = ({ 
  icon: Icon, 
  fallback, 
  className = '', 
  size = 24 
}: SafeIconProps) => {
  if (!Icon) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallback || (
          <div className="w-6 h-6 bg-secondary-200 rounded flex items-center justify-center">
            <span className="text-xs">?</span>
          </div>
        )}
      </div>
    )
  }

  return <Icon size={size} className={className} />
}
