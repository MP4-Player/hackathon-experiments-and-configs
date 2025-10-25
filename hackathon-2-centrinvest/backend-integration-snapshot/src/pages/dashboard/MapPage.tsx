import { useState, useEffect } from 'react'
import { Search, MapPin, Navigation, Route } from 'lucide-react'
import { apiService } from '@/services/api'

export const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Load map locations
    const loadLocations = async () => {
      try {
        await apiService.get('/map/locations')
        setMapLoaded(true)
      } catch (error) {
        console.error('Error loading locations:', error)
        setMapLoaded(true)
      }
    }

    loadLocations()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement address search
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          <div className="grid grid-cols-3 gap-2 lg:flex lg:items-center lg:space-x-2">
            <button className="btn-secondary flex items-center justify-center text-xs lg:text-sm px-2 lg:px-4 py-2">
              <MapPin className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Местоположения</span>
            </button>
            <button className="btn-secondary flex items-center justify-center text-xs lg:text-sm px-2 lg:px-4 py-2">
              <Route className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Маршруты</span>
            </button>
            <button className="btn-primary flex items-center justify-center text-xs lg:text-sm px-2 lg:px-4 py-2">
              <Navigation className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Навигация</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-primary-50 to-accent-50">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
              <p className="text-text-secondary text-lg">Загрузка карты...</p>
            </div>
          </div>
        ) : (
          <div className="h-full relative overflow-hidden">
            {/* Интерактивные элементы карты */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-800">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4 text-gray-800">
                  Интерактивная карта
                </h3>
                <p className="text-xl mb-8 max-w-2xl text-gray-600">
                  Здесь будет отображаться карта с местоположениями встреч, клиентов и задач
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-center sm:space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Встречи</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Клиенты</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Задачи</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">VIP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
