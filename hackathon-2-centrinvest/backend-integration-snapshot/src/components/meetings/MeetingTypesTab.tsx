import { useState, useEffect } from 'react'
import { MeetingWithType, MeetingTypeCategory, MeetingType } from '@/types'
import { Pencil, Trash2, Save, Plus, Settings, MapPin } from 'lucide-react'

interface MeetingTypesTabProps {
  meetings: MeetingWithType[]
  onSave: (meetings: MeetingWithType[]) => void
  onCreateMeeting: () => void
  onEditMeeting: (meeting: MeetingWithType) => void
  onDeleteMeeting: (meetingId: string) => void
  startingPoint?: string
  onSetStartingPoint: (address: string) => void
}

const DEFAULT_MEETING_TYPES: MeetingTypeCategory[] = [
  {
    id: 'work_meeting',
    label: 'Знакомство',
    duration: 30,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  {
    id: 'partner_meeting',
    label: 'Презентация',
    duration: 60,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
  {
    id: 'client_meeting',
    label: 'Обсуждение',
    duration: 45,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  {
    id: 'briefing',
    label: 'Подписание',
    duration: 30,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
  },
  {
    id: 'product_presentation',
    label: 'Консультация',
    duration: 90,
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-300',
  },
  {
    id: 'business_lunch',
    label: 'Бизнес ланч',
    duration: 120,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
  },
  {
    id: 'other',
    label: 'Иное',
    duration: 60,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
]

interface CategoryEditModalProps {
  category: MeetingTypeCategory
  isOpen: boolean
  onClose: () => void
  onSave: (id: MeetingType, label: string, duration: number) => void
}

const CategoryEditModal = ({ category, isOpen, onClose, onSave }: CategoryEditModalProps) => {
  const [label, setLabel] = useState(category.label)
  const [duration, setDuration] = useState(category.duration || 30)

  useEffect(() => {
    setLabel(category.label)
    setDuration(category.duration || 30)
  }, [category])

  if (!isOpen) return null

  const handleSave = () => {
    onSave(category.id, label, duration)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Редактировать категорию</h3>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Продолжительность (минут)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}

export const MeetingTypesTab = ({
  meetings,
  onSave,
  onCreateMeeting,
  onEditMeeting,
  onDeleteMeeting,
  startingPoint,
  onSetStartingPoint,
}: MeetingTypesTabProps) => {
  const [localMeetings, setLocalMeetings] = useState<MeetingWithType[]>(meetings)
  const [meetingTypes, setMeetingTypes] = useState<MeetingTypeCategory[]>(DEFAULT_MEETING_TYPES)
  const [draggedMeeting, setDraggedMeeting] = useState<MeetingWithType | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<MeetingTypeCategory | null>(null)
  const [isStartingPointModalOpen, setIsStartingPointModalOpen] = useState(false)
  const [startingPointAddress, setStartingPointAddress] = useState(startingPoint || '')

  // Touch drag state
  const [touchDragTarget, setTouchDragTarget] = useState<MeetingType | undefined>(undefined)

  useEffect(() => {
    setLocalMeetings(meetings)
  }, [meetings])

  // Mouse drag handlers
  const handleDragStart = (meeting: MeetingWithType) => {
    setDraggedMeeting(meeting)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (meetingType?: MeetingType) => {
    if (!draggedMeeting) return

    const updatedMeetings = localMeetings.map((m) =>
      m.id === draggedMeeting.id ? { ...m, meetingType } : m
    )

    setLocalMeetings(updatedMeetings)
    setDraggedMeeting(null)
    setTouchDragTarget(undefined)
  }

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, meeting: MeetingWithType) => {
    e.preventDefault()
    setDraggedMeeting(meeting)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedMeeting) return

    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)

    // Find the drop zone
    const dropZone = element?.closest('[data-drop-zone]')
    if (dropZone) {
      const targetType = dropZone.getAttribute('data-drop-zone')
      setTouchDragTarget(targetType === 'undefined' ? undefined : targetType as MeetingType)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedMeeting) return

    const touch = e.changedTouches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropZone = element?.closest('[data-drop-zone]')

    if (dropZone) {
      const targetType = dropZone.getAttribute('data-drop-zone')
      const meetingType = targetType === 'undefined' ? undefined : targetType as MeetingType

      const updatedMeetings = localMeetings.map((m) =>
        m.id === draggedMeeting.id ? { ...m, meetingType } : m
      )

      setLocalMeetings(updatedMeetings)
    }

    setDraggedMeeting(null)
    setTouchDragTarget(undefined)
  }

  const handleSave = () => {
    onSave(localMeetings)
  }

  const handleDeleteClick = (meetingId: string) => {
    if (deleteConfirm === meetingId) {
      onDeleteMeeting(meetingId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(meetingId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleCategoryEdit = (id: MeetingType, label: string, duration: number) => {
    setMeetingTypes(prevTypes =>
      prevTypes.map(type =>
        type.id === id ? { ...type, label, duration } : type
      )
    )
  }

  const getMeetingsByType = (type?: MeetingType) => {
    return localMeetings.filter((m) => m.meetingType === type)
  }

  const unassignedMeetings = getMeetingsByType(undefined)

  const renderMeetingCard = (meeting: MeetingWithType) => (
    <div
      key={meeting.id}
      draggable
      onDragStart={() => handleDragStart(meeting)}
      onTouchStart={(e) => handleTouchStart(e, meeting)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`bg-white border-2 border-gray-200 rounded-md p-1.5 sm:p-2 cursor-move hover:shadow-md transition-shadow touch-none ${
        draggedMeeting?.id === meeting.id ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="font-medium text-xs sm:text-sm text-gray-900 flex-1 line-clamp-1">
          {meeting.title}
        </h4>
        <div className="flex space-x-1 ml-1">
          <button
            onClick={() => onEditMeeting(meeting)}
            className="p-0.5 sm:p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Редактировать"
          >
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(meeting.id)}
            className={`p-0.5 sm:p-1 transition-colors ${
              deleteConfirm === meeting.id
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-500 hover:text-red-600'
            }`}
            title={deleteConfirm === meeting.id ? 'Подтвердить удаление' : 'Удалить'}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-0.5 text-xs">
        {meeting.clientName && (
          <p className="text-gray-600 line-clamp-1">
            <span className="font-medium">Клиент:</span> {meeting.clientName}
          </p>
        )}
        {meeting.location && (
          <p className="text-gray-600 line-clamp-1">
            <span className="font-medium">Место:</span> {meeting.location}
          </p>
        )}
        <div className="flex items-center justify-between mt-1">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
              meeting.priority === 'vip'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {meeting.priority === 'vip' ? 'VIP' : 'Стандарт'}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900">
            Типы встреч
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setIsStartingPointModalOpen(true)}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              title={startingPoint || 'Указать начальную точку'}
            >
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Начальная точка</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Сохранить</span>
            </button>
            <button
              onClick={onCreateMeeting}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Создать</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Always 2 columns */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-4 h-full">
          {/* Left Column - Unassigned Meetings */}
          <div
            data-drop-zone="undefined"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(undefined)}
            className={`bg-gray-50 rounded-md border-2 border-dashed p-1.5 sm:p-3 overflow-y-auto transition-colors ${
              touchDragTarget === undefined ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 sticky top-0 bg-gray-50">
              Не распределено ({unassignedMeetings.length})
            </h3>
            <div className="space-y-1 sm:space-y-2">
              {unassignedMeetings.length > 0 ? (
                unassignedMeetings.map(renderMeetingCard)
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  Нет встреч
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Meeting Type Categories */}
          <div className="overflow-y-auto pr-1">
            <div className="space-y-1.5 sm:space-y-3">
              {meetingTypes.map((type) => {
                const typeMeetings = getMeetingsByType(type.id)
                return (
                  <div
                    key={type.id}
                    data-drop-zone={type.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(type.id)}
                    className={`${type.bgColor} border-2 rounded-md p-1.5 sm:p-3 transition-all ${
                      touchDragTarget === type.id ? 'border-blue-500 ring-2 ring-blue-300' : type.borderColor
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-xs sm:text-sm font-semibold ${type.color} line-clamp-1`}>
                          {type.label}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {type.duration} мин · {typeMeetings.length} встреч
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingCategory(type)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors ml-1"
                        title="Редактировать категорию"
                      >
                        <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      {typeMeetings.length > 0 ? (
                        typeMeetings.map(renderMeetingCard)
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-2">
                          Перетащите встречу сюда
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Edit Modal */}
      {editingCategory && (
        <CategoryEditModal
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleCategoryEdit}
        />
      )}

      {/* Starting Point Modal */}
      {isStartingPointModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-md">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Начальная точка маршрута</h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Адрес
                </label>
                <input
                  type="text"
                  value={startingPointAddress}
                  onChange={(e) => setStartingPointAddress(e.target.value)}
                  placeholder="Введите адрес откуда начнете маршрут"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
              <button
                onClick={() => {
                  setIsStartingPointModalOpen(false)
                  setStartingPointAddress(startingPoint || '')
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onSetStartingPoint(startingPointAddress)
                  setIsStartingPointModalOpen(false)
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
