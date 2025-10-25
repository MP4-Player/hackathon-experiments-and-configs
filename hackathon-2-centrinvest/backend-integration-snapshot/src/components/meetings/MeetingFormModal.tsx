import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { MeetingWithType, MeetingType } from '@/types'

interface MeetingFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (meeting: Partial<MeetingWithType>) => void
  meeting?: MeetingWithType
  mode: 'create' | 'edit'
}

export const MeetingFormModal = ({
  isOpen,
  onClose,
  onSave,
  meeting,
  mode,
}: MeetingFormModalProps) => {
  const [formData, setFormData] = useState<Partial<MeetingWithType>>({
    title: '',
    description: '',
    clientName: '',
    location: '',
    address: '',
    startDate: '',
    endDate: '',
    priority: 'standard',
    meetingType: undefined,
    meetingTypeId: undefined,
  })

  useEffect(() => {
    if (meeting && mode === 'edit') {
      setFormData(meeting)
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        clientName: '',
        location: '',
        address: '',
        startDate: '',
        endDate: '',
        priority: 'standard',
        meetingType: undefined,
        meetingTypeId: undefined,
      })
    }
  }, [meeting, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Преобразуем данные формы в формат, ожидаемый API
    const meetingData = {
      ...formData,
      // Преобразуем clientName в clientId (временно используем фиктивный ID)
      // В реальном приложении здесь должен быть выбор клиента из списка
      clientId: '00000000-0000-0000-0000-000000000001', // Временный ID клиента
      employeeId: '00000000-0000-0000-0000-000000000001', // Временный ID сотрудника
      // Убираем поля, которые не нужны API
      clientName: undefined,
      meetingType: undefined,
    }
    
    onSave(meetingData)
    onClose()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  const meetingTypeOptions: { value: MeetingType; label: string }[] = [
    { value: 'work_meeting', label: 'Рабочие совещания' },
    { value: 'partner_meeting', label: 'Встречи с партнерами' },
    { value: 'client_meeting', label: 'Встречи с клиентами' },
    { value: 'briefing', label: 'Брифинг' },
    { value: 'product_presentation', label: 'Презентация продукта' },
    { value: 'business_lunch', label: 'Бизнес ланч' },
    { value: 'other', label: 'Иное' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Создать встречу' : 'Редактировать встречу'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Title and Client Name in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Название *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="Название встречи"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  С кем встреча *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="Имя клиента"
                />
              </div>
            </div>

            {/* Meeting Type and Priority in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Тип встречи
                </label>
                <select
                  name="meetingTypeId"
                  value={formData.meetingTypeId || ''}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                >
                  <option value="">Выберите тип</option>
                  {meetingTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Приоритет *
                </label>
                <div className="flex space-x-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="standard"
                      checked={formData.priority === 'standard'}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="text-xs text-gray-700">Стандарт</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="vip"
                      checked={formData.priority === 'vip'}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="text-xs text-purple-700 font-semibold">VIP</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Date and Time - compact layout */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Начало *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate?.slice(0, 16)}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Окончание *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate?.slice(0, 16)}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                />
              </div>
            </div>

            {/* Location and Address in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Место *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="Офис, кафе"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Адрес *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="Полный адрес"
                />
              </div>
            </div>

            {/* Description - full width but compact */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="input-field text-sm py-2 resize-none"
                placeholder="Краткое описание встречи"
              />
            </div>

            {/* Actions - compact buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="flex-1 btn-primary text-sm py-2"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}