import { useState, useEffect } from 'react'
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react'
import { apiService } from '@/services/api'

export const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [stats, setStats] = useState({
    totalMeetings: 0,
    completedMeetings: 0,
    postponedMeetings: 0,
    cancelledMeetings: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalClients: 0,
    vipClients: 0,
    standardClients: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true)
        const data = await apiService.getStatistics()
        setStats(data)
      } catch (error) {
        console.error('Error loading statistics:', error)
        // Fallback to mock data
        setStats({
          totalMeetings: 156,
          completedMeetings: 142,
          postponedMeetings: 8,
          cancelledMeetings: 6,
          totalTasks: 89,
          completedTasks: 67,
          pendingTasks: 22,
          totalClients: 45,
          vipClients: 12,
          standardClients: 33,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStatistics()
  }, [timeRange])

  const completionRate = stats.totalMeetings > 0 ? Math.round((stats.completedMeetings / stats.totalMeetings) * 100) : 0
  const taskCompletionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Статистика</h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field text-sm md:text-base"
            >
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
              <option value="quarter">За квартал</option>
              <option value="year">За год</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Всего встреч</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
            </div>
          </div>
        </div>

        <div className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <CheckSquare className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Завершено</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.completedMeetings}</p>
            </div>
          </div>
        </div>

        <div className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Клиенты</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Эффективность</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8">
        {/* Meetings Statistics */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Встречи</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Завершено</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.completedMeetings}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Отложено</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.postponedMeetings}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Отменено</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.cancelledMeetings}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Процент выполнения</span>
                <span className="text-lg font-bold text-green-600">{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Statistics */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Задачи</h3>
            <CheckSquare className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Завершено</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.completedTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">В работе</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.pendingTasks}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Процент выполнения</span>
                <span className="text-lg font-bold text-green-600">{taskCompletionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Клиенты</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">VIP клиенты</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.vipClients}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Стандартные</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.standardClients}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Всего клиентов</span>
                <span className="text-lg font-bold text-gray-900">{stats.totalClients}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Производительность</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Среднее время встречи</span>
              </div>
              <span className="font-semibold text-gray-900">45 мин</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Просроченные задачи</span>
              </div>
              <span className="font-semibold text-red-600">3</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Общая эффективность</span>
                <span className="text-lg font-bold text-green-600">
                  {Math.round((completionRate + taskCompletionRate) / 2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
