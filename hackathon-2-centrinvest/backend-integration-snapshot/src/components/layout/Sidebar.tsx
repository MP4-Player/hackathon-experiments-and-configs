import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  MapPin,
  Calendar,
  Users,
  CheckSquare,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  Grid3x3,
  ClipboardList
} from 'lucide-react'

const navigation = [
  { name: 'Карта', href: '/dashboard/map', icon: MapPin },
  { name: 'Типы встреч', href: '/dashboard/meeting-types', icon: Grid3x3 },
  { name: 'Расписание', href: '/dashboard/schedule', icon: ClipboardList },
  { name: 'Статистика', href: '/dashboard/statistics', icon: BarChart3 },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  // Закрыть мобильное меню при изменении маршрута
  useEffect(() => {
    onClose()
  }, [location.pathname])

  return (
    <>
      {/* Затемненный фон для мобильных устройств */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white shadow-lg transition-all duration-300 z-50
        ${collapsed ? 'w-16' : 'w-64'}
        lg:relative fixed inset-y-0 left-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="flex flex-col h-full">
{/* Header */}
<div className="flex items-center justify-between p-2 border-b-1 border-gray-200">
  {!collapsed && (
    <div className="flex items-center space-x-3">
      <img
        src="/src/assets/images/logo.png"
        alt="ЦентрИнвест"
        className="h-8 w-8 object-contain"
      />
      <div>
        <h1 className="text-lg font-bold text-gray-900">ЦентрИнвест</h1>
        <p className="text-xs text-gray-500">Управление встречами</p>
      </div>
    </div>
  )}
  <div className="flex items-center space-x-2">
    {/* Кнопка закрытия для мобильных */}
    <button
      onClick={onClose}
      className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <X className="h-5 w-5 text-gray-500" />
    </button>
    {/* Кнопка сворачивания для десктопа */}
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="hidden lg:block p-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      {collapsed ? (
        <ChevronRight className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronLeft className="h-5 w-5 text-gray-500" />
      )}
    </button>
  </div>
</div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          {!collapsed && user && (
            <div className="mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              title={collapsed ? 'Уведомления' : undefined}
            >
              <Bell className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">Уведомления</span>}
            </button>
            
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              title={collapsed ? 'Помощь' : undefined}
            >
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">Помощь</span>}
            </button>
            
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
              title={collapsed ? 'Выход' : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">Выход</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
