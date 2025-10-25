import { useState } from 'react'
import { Save, Navigation, MapPin, Clock, User, GripVertical, Star } from 'lucide-react'
import { MeetingWithType, ScheduleItem } from '@/types'

interface ScheduleTabProps {
  schedule: ScheduleItem[]
  onSave: (schedule: ScheduleItem[]) => void
  onOptimizeRoute: () => void
  isOptimizing?: boolean
}

export const ScheduleTab = ({
  schedule,
  onSave,
  onOptimizeRoute,
  isOptimizing = false,
}: ScheduleTabProps) => {
  const [localSchedule, setLocalSchedule] = useState<ScheduleItem[]>(schedule)
  const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)
  const [touchDragItem, setTouchDragItem] = useState<ScheduleItem | null>(null)

  const handleDragStart = (item: ScheduleItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent, targetItem: ScheduleItem) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetItem.id) return

    const draggedIndex = localSchedule.findIndex((i) => i.id === draggedItem.id)
    const targetIndex = localSchedule.findIndex((i) => i.id === targetItem.id)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newSchedule = [...localSchedule]
    newSchedule.splice(draggedIndex, 1)
    newSchedule.splice(targetIndex, 0, draggedItem)

    // Update order
    const updatedSchedule = newSchedule.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    setLocalSchedule(updatedSchedule)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSave = () => {
    onSave(localSchedule)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
    })
  }

  const getMeetingTypeLabel = (meeting: MeetingWithType) => {
    const typeLabels = {
      work_meeting: 'Знакомство',
      partner_meeting: 'Презентация',
      client_meeting: 'Обсуждение',
      briefing: 'Подписание',
      product_presentation: 'Консультация',
      business_lunch: 'Бизнес ланч',
      other: 'Иное',
    }
    return meeting.meetingType ? typeLabels[meeting.meetingType] : 'Не указано'
  }

  // Group meetings by date
  const groupMeetingsByDate = () => {
    const groups: { [key: string]: ScheduleItem[] } = {}

    localSchedule.forEach((item) => {
      const dateKey = new Date(item.meeting.startDate).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(item)
    })

    return groups
  }

  const meetingsByDate = groupMeetingsByDate()

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, item: ScheduleItem) => {
    setTouchDragItem(item)
    setDraggedItem(item)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragItem) return
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent, targetItem: ScheduleItem) => {
    if (!touchDragItem || touchDragItem.id === targetItem.id) {
      setTouchDragItem(null)
      setDraggedItem(null)
      return
    }

    const draggedIndex = localSchedule.findIndex((i) => i.id === touchDragItem.id)
    const targetIndex = localSchedule.findIndex((i) => i.id === targetItem.id)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newSchedule = [...localSchedule]
    newSchedule.splice(draggedIndex, 1)
    newSchedule.splice(targetIndex, 0, touchDragItem)

    const updatedSchedule = newSchedule.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    setLocalSchedule(updatedSchedule)
    setTouchDragItem(null)
    setDraggedItem(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with buttons */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <button
          onClick={handleSave}
          className="btn-primary flex items-center px-4 py-2 text-sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Сохранить
        </button>
        <button
          onClick={onOptimizeRoute}
          disabled={isOptimizing}
          className={`btn-accent flex items-center px-4 py-2 text-sm ${
            isOptimizing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isOptimizing ? 'Оптимизация...' : 'Оптимизировать маршрут'}
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Schedule List - Upper half */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sticky top-0 bg-white pb-2">
            Расписание встреч ({localSchedule.length})
          </h3>

          {localSchedule.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Нет встреч в расписании</p>
            </div>
          ) : (
            Object.entries(meetingsByDate).map(([date, items]) => (
              <div key={date} className="mb-4">
                {/* Date Header */}
                <div className="sticky top-12 bg-white border-b-2 border-primary-200 pb-2 mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-primary-700">
                    {date} <span className="text-gray-500 font-normal">({items.length} встреч)</span>
                  </h4>
                </div>

                {/* Meetings for this date */}
                <div className="space-y-2">
                  {items.map((item) => {
                    const globalIndex = localSchedule.findIndex(i => i.id === item.id)
                    return (
                      <ScheduleItemCard
                        key={item.id}
                        item={item}
                        index={globalIndex}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        isDragging={draggedItem?.id === item.id}
                        formatTime={formatTime}
                        formatDate={formatDate}
                        getMeetingTypeLabel={getMeetingTypeLabel}
                      />
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map - Lower half */}
        <div className="h-64 md:h-80 border-t-4 border-gray-200 bg-gray-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-primary-400" />
              <p className="text-sm text-gray-600">Карта с маршрутом</p>
              <p className="text-xs text-gray-400 mt-1">
                API для отображения карты будет подключен здесь
              </p>
            </div>
          </div>
          {/* Placeholder for map - API endpoint will be added */}
          <div id="schedule-map" className="w-full h-full"></div>
        </div>
      </div>
    </div>
  )
}

interface ScheduleItemCardProps {
  item: ScheduleItem
  index: number
  onDragStart: (item: ScheduleItem) => void
  onDragOver: (e: React.DragEvent, item: ScheduleItem) => void
  onDragEnd: () => void
  onTouchStart: (e: React.TouchEvent, item: ScheduleItem) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent, item: ScheduleItem) => void
  isDragging: boolean
  formatTime: (date: string) => string
  formatDate: (date: string) => string
  getMeetingTypeLabel: (meeting: MeetingWithType) => string
}

const ScheduleItemCard = ({
  item,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isDragging,
  formatTime,
  formatDate,
  getMeetingTypeLabel,
}: ScheduleItemCardProps) => {
  const meeting = item.meeting

  return (
    <div
      draggable
      onDragStart={() => onDragStart(item)}
      onDragOver={(e) => onDragOver(e, item)}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart(e, item)}
      onTouchMove={onTouchMove}
      onTouchEnd={(e) => onTouchEnd(e, item)}
      className={`bg-white border-2 border-gray-200 rounded-lg p-2 sm:p-4 cursor-move hover:shadow-lg transition-all duration-200 touch-none ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Order number and drag handle */}
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Meeting details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and VIP badge */}
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              {meeting.title}
            </h4>
            {meeting.priority === 'vip' && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-2 flex-shrink-0" />
            )}
          </div>

          {/* Meeting type */}
          <div className="flex items-center text-xs text-gray-600">
            <span className="font-medium mr-1">Тип:</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
              {getMeetingTypeLabel(meeting)}
            </span>
          </div>

          {/* Client */}
          <div className="flex items-center text-xs text-gray-600">
            <User className="h-3 w-3 mr-1.5 text-gray-400" />
            <span>{meeting.clientName}</span>
            {meeting.priority === 'vip' && (
              <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                VIP
              </span>
            )}
          </div>

          {/* Time */}
          <div className="flex items-center text-xs text-gray-600">
            <Clock className="h-3 w-3 mr-1.5 text-gray-400" />
            <span>
              {formatDate(meeting.startDate)} • {formatTime(meeting.startDate)} -{' '}
              {formatTime(meeting.endDate)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1.5 text-gray-400" />
            <span className="truncate">{meeting.location}</span>
          </div>

          {/* Travel time (if available) */}
          {item.estimatedTravelTime && item.estimatedTravelTime > 0 && (
            <div className="flex items-center text-xs text-orange-600 bg-orange-50 rounded px-2 py-1 mt-2">
              <Navigation className="h-3 w-3 mr-1.5" />
              <span>
                ~{item.estimatedTravelTime} мин в пути
                {item.distance && ` • ${(item.distance / 1000).toFixed(1)} км`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
