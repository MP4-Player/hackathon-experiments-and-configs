import { useState } from 'react'
import { useMeetings } from '@/hooks/useMeetings'
import { MeetingWithType } from '@/types'
import { MeetingTypesTab } from '@/components/meetings/MeetingTypesTab'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'

export const MeetingTypesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<MeetingWithType | undefined>()
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [startingPoint, setStartingPoint] = useState<string>('')

  const { data: meetingsData, isLoading } = useMeetings({})

  const meetings: MeetingWithType[] = meetingsData?.data || []

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

  const handleDeleteMeeting = (meetingId: string) => {
    console.log('Delete meeting:', meetingId)
  }

  const handleSaveMeetings = (updatedMeetings: MeetingWithType[]) => {
    console.log('Save meetings:', updatedMeetings)
  }

  const handleSaveMeeting = (meeting: Partial<MeetingWithType>) => {
    if (modalMode === 'create') {
      console.log('Create meeting:', meeting)
    } else {
      console.log('Update meeting:', meeting)
    }
  }

  const handleSetStartingPoint = (address: string) => {
    setStartingPoint(address)
    console.log('Starting point set:', address)
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
      <MeetingTypesTab
        meetings={meetings}
        onSave={handleSaveMeetings}
        onCreateMeeting={handleCreateMeeting}
        onEditMeeting={handleEditMeeting}
        onDeleteMeeting={handleDeleteMeeting}
        startingPoint={startingPoint}
        onSetStartingPoint={handleSetStartingPoint}
      />

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
