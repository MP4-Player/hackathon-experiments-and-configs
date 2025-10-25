import { useState } from 'react'
import { useMeetings, useCreateMeeting, useUpdateMeeting, useDeleteMeeting, useOptimizeRoute } from '@/hooks/useMeetings'
import { MeetingWithType, ScheduleItem } from '@/types'
import { MeetingTypesTab } from '@/components/meetings/MeetingTypesTab'
import { ScheduleTab } from '@/components/meetings/ScheduleTab'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'

export const MeetingsPage = () => {
  const [activeTab, setActiveTab] = useState<'types' | 'schedule'>('types')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<MeetingWithType | undefined>()
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const { data: meetingsData, isLoading } = useMeetings({})
  const createMeetingMutation = useCreateMeeting()
  const updateMeetingMutation = useUpdateMeeting()
  const deleteMeetingMutation = useDeleteMeeting()
  const optimizeRouteMutation = useOptimizeRoute()

  // Convert meetings to MeetingWithType
  const meetings: MeetingWithType[] = meetingsData?.data || []

  // Create schedule from meetings
  const schedule: ScheduleItem[] = meetings.map((meeting, index) => ({
    id: `schedule-${meeting.id}`,
    meetingId: meeting.id,
    meeting,
    order: index + 1,
  }))

  const handleCreateMeeting = () => {
    setModalMode('create')
    setEditingMeeting(undefined)
    setIsModalOpen(true)
  }

  const handleEditMeeting = (meeting: MeetingWithType) => {
    setModalMode('edit')
    setEditingMeeting(meeting)
    setIsModalOpen(true)
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту встречу?')) {
      try {
        await deleteMeetingMutation.mutateAsync(meetingId)
      } catch (error) {
        console.error('Error deleting meeting:', error)
      }
    }
  }

  const handleSaveMeetings = (updatedMeetings: MeetingWithType[]) => {
    // TODO: Implement bulk update if needed
    console.log('Save meetings:', updatedMeetings)
  }

  const handleSaveSchedule = (updatedSchedule: ScheduleItem[]) => {
    // TODO: Implement schedule update
    console.log('Save schedule:', updatedSchedule)
  }

  const handleOptimizeRoute = async () => {
    const meetingIds = meetings.map(m => m.id)
    if (meetingIds.length === 0) {
      alert('Нет встреч для оптимизации')
      return
    }

    try {
      const result = await optimizeRouteMutation.mutateAsync({
        meetingIds,
        startLocation: {
          latitude: 55.7558,
          longitude: 37.6176,
          address: 'Москва, Красная площадь'
        }
      })
      console.log('Optimized route:', result)
    } catch (error) {
      console.error('Error optimizing route:', error)
    }
  }

  const handleSaveMeeting = async (meeting: Partial<MeetingWithType>) => {
    try {
      if (modalMode === 'create') {
        await createMeetingMutation.mutateAsync(meeting as any)
      } else if (editingMeeting) {
        await updateMeetingMutation.mutateAsync({
          id: editingMeeting.id,
          meeting: meeting as any
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving meeting:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка встреч...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Встречи
          </h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('types')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'types'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Типы встреч
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'schedule'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Расписание
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'types' ? (
          <MeetingTypesTab
            meetings={meetings}
            onSave={handleSaveMeetings}
            onCreateMeeting={handleCreateMeeting}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        ) : (
          <ScheduleTab
            schedule={schedule}
            onSave={handleSaveSchedule}
            onOptimizeRoute={handleOptimizeRoute}
          />
        )}
      </div>

      {/* Meeting Form Modal */}
      <MeetingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeeting}
        meeting={editingMeeting}
        mode={modalMode}
      />
    </div>
  )
}

