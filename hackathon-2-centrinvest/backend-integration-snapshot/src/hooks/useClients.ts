import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Client, CreateClientData, ClientFilters } from '@/types'
import toast from 'react-hot-toast'

export const useClients = (filters?: ClientFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['clients', filters, page, limit],
    queryFn: () => apiService.getClients(filters, page, limit),
  })
}

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => apiService.getClient(id),
    enabled: !!id,
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (client: CreateClientData) => apiService.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Клиент создан успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания клиента')
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, client }: { id: string; client: CreateClientData }) => 
      apiService.updateClient(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Клиент обновлен успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления клиента')
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Клиент удален успешно')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления клиента')
    },
  })
} {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => apiService.get(`/clients/${id}`),
    enabled: !!id,
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClientData) => apiService.post('/clients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Клиент создан успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания клиента')
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientData> }) =>
      apiService.put(`/clients/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', id] })
      toast.success('Клиент обновлен успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления клиента')
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Клиент удален успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления клиента')
    },
  })
}
