import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Task, CreateTaskData, TaskFilters } from '@/types'
import toast from 'react-hot-toast'

export const useTasks = (filters?: TaskFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['tasks', filters, page, limit],
    queryFn: () => apiService.getTasks(filters, page, limit),
  })
}

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => apiService.getTask(id),
    enabled: !!id,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (task: CreateTaskData) => apiService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Задача создана успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания задачи')
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: CreateTaskData }) => 
      apiService.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Задача обновлена успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления задачи')
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Задача удалена успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления задачи')
    },
  })
} {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => apiService.get(`/tasks/${id}`),
    enabled: !!id,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskData) => apiService.post('/tasks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Задача создана успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания задачи')
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskData> }) =>
      apiService.put(`/tasks/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', id] })
      toast.success('Задача обновлена успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления задачи')
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Задача удалена успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления задачи')
    },
  })
}

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      apiService.put(`/tasks/${id}/status`, { status }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', id] })
      toast.success('Статус задачи обновлен!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления статуса')
    },
  })
}
