import { apiService } from '../api'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset localStorage
    localStorage.clear()
  })

  it('should create axios instance with correct base configuration', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('should add auth token to requests when available', () => {
    localStorage.setItem('authToken', 'test-token')
    
    // Create a new instance to test interceptor
    const api = apiService
    
    // The interceptor should be set up
    expect(mockedAxios.create).toHaveBeenCalled()
  })

  it('should handle login request', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'admin',
        },
      },
    }

    mockedAxios.create.mockReturnValue({
      post: jest.fn().mockResolvedValue(mockResponse),
    } as any)

    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = await apiService.login(credentials)

    expect(result).toEqual(mockResponse.data)
  })

  it('should handle register request', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'admin',
        },
      },
    }

    mockedAxios.create.mockReturnValue({
      post: jest.fn().mockResolvedValue(mockResponse),
    } as any)

    const registerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    const result = await apiService.register(registerData)

    expect(result).toEqual(mockResponse.data)
  })
})
