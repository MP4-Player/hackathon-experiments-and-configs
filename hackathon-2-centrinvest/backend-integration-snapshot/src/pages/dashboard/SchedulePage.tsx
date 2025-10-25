import { useMeetings } from '@/hooks/useMeetings'
import { ScheduleItem } from '@/types'
import { ScheduleTab } from '@/components/meetings/ScheduleTab'

export const SchedulePage = () => {
  const { data: meetingsData, isLoading } = useMeetings({})

  const meetings = meetingsData?.data || []

  const schedule: ScheduleItem[] = meetings.map((meeting, index) => ({
    id: `schedule-${meeting.id}`,
    meetingId: meeting.id,
    meeting,
    order: index + 1,
  }))

  const handleSaveSchedule = (updatedSchedule: ScheduleItem[]) => {
    console.log('Save schedule:', updatedSchedule)
  }

  const handleOptimizeRoute = () => {
    console.log('Optimize route')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка расписания...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ScheduleTab
        schedule={schedule}
        onSave={handleSaveSchedule}
        onOptimizeRoute={handleOptimizeRoute}
      />
    </div>
  )
}
