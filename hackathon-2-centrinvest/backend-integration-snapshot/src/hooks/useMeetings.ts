import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Meeting, CreateMeetingData, MeetingFilters } from '@/types'
import toast from 'react-hot-toast'

export const useMeetings = (filters?: MeetingFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['meetings', filters, page, limit],
    queryFn: () => apiService.getMeetings(filters, page, limit),
  })
}

export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => apiService.getMeeting(id),
    enabled: !!id,
  })
}

export const useCreateMeeting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (meeting: CreateMeetingData) => apiService.createMeeting(meeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      toast.success('Встреча создана успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания встречи')
    },
  })
}

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, meeting }: { id: string; meeting: CreateMeetingData }) => 
      apiService.updateMeeting(id, meeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      toast.success('Встреча обновлена успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления встречи')
    },
  })
}

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      toast.success('Встреча удалена успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления встречи')
    },
  })
}

export const useMeetingTypes = () => {
  return useQuery({
    queryKey: ['meeting-types'],
    queryFn: () => apiService.getMeetingTypes(),
  })
}

export const useCreateMeetingType = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (meetingType: any) => apiService.createMeetingType(meetingType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-types'] })
      toast.success('Тип встречи создан успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания типа встречи')
    },
  })
}

export const useOptimizeRoute = () => {
  return useMutation({
    mutationFn: (request: any) => apiService.optimizeRoute(request),
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка оптимизации маршрута')
    },
  })
}