import { AuthResponse, LoginCredentials, RegisterData, Meeting, CreateMeetingData, Client, CreateClientData, Task, CreateTaskData, Statistics, RouteOptimizationRequest, RouteOptimizationResponse } from '@/types'

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return this.handleResponse<AuthResponse>(response)
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      })
    })
    return this.handleResponse<AuthResponse>(response)
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    })
    await this.handleResponse(response)
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse<T>(response)
  }

  // Specific API methods
  async getMeetings(filters?: any, page = 1, limit = 10): Promise<{ data: Meeting[] }> {
    const meetings = await this.get<Meeting[]>('/meetings', { ...filters, page, limit })
    return { data: meetings }
  }

  async getMeeting(id: string): Promise<Meeting> {
    return this.get<Meeting>(`/meetings/${id}`)
  }

  async createMeeting(meeting: CreateMeetingData): Promise<Meeting> {
    return this.post<Meeting>('/meetings', meeting)
  }

  async updateMeeting(id: string, meeting: CreateMeetingData): Promise<Meeting> {
    return this.put<Meeting>(`/meetings/${id}`, meeting)
  }

  async deleteMeeting(id: string): Promise<void> {
    await this.delete(`/meetings/${id}`)
  }

  async getClients(filters?: any, page = 1, limit = 10): Promise<{ data: Client[] }> {
    const clients = await this.get<Client[]>('/clients', { ...filters, page, limit })
    return { data: clients }
  }

  async getClient(id: string): Promise<Client> {
    return this.get<Client>(`/clients/${id}`)
  }

  async createClient(client: CreateClientData): Promise<Client> {
    return this.post<Client>('/clients', client)
  }

  async updateClient(id: string, client: CreateClientData): Promise<Client> {
    return this.put<Client>(`/clients/${id}`, client)
  }

  async deleteClient(id: string): Promise<void> {
    await this.delete(`/clients/${id}`)
  }

  async getTasks(filters?: any, page = 1, limit = 10): Promise<{ data: Task[] }> {
    const tasks = await this.get<Task[]>('/tasks', { ...filters, page, limit })
    return { data: tasks }
  }

  async getTask(id: string): Promise<Task> {
    return this.get<Task>(`/tasks/${id}`)
  }

  async createTask(task: CreateTaskData): Promise<Task> {
    return this.post<Task>('/tasks', task)
  }

  async updateTask(id: string, task: CreateTaskData): Promise<Task> {
    return this.put<Task>(`/tasks/${id}`, task)
  }

  async deleteTask(id: string): Promise<void> {
    await this.delete(`/tasks/${id}`)
  }

  async getStatistics(): Promise<Statistics> {
    return this.get<Statistics>('/statistics')
  }

  async getMeetingTypes(): Promise<any[]> {
    return this.get<any[]>('/meeting-types')
  }

  async createMeetingType(meetingType: any): Promise<any> {
    return this.post<any>('/meeting-types', meetingType)
  }

  // Route optimization
  async optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimizationResponse> {
    return this.post<RouteOptimizationResponse>('/meetings/optimize-route', request)
  }

  // Get map locations for schedule
  async getScheduleMapLocations(scheduleItems: any[]): Promise<any> {
    // This would typically call a backend endpoint, but for now we'll process locally
    return scheduleItems.map((item, index) => ({
      id: item.id,
      order: item.order,
      latitude: item.meeting.latitude || 55.7558 + (Math.random() - 0.5) * 0.1,
      longitude: item.meeting.longitude || 37.6176 + (Math.random() - 0.5) * 0.1,
      address: item.meeting.address,
      title: item.meeting.title,
      type: 'meeting',
    }))
  }
}

export const apiService = new ApiService()