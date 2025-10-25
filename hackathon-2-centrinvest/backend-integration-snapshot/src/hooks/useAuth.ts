import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '@/services/authService'
import { AuthUser, LoginCredentials, RegisterData } from '@/types'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = AuthService.getUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const response = await AuthService.login(credentials)
      setUser(response.user)
      toast.success('Успешная авторизация!')
      navigate('/dashboard')
      return response
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка авторизации')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      const response = await AuthService.register(data)
      setUser(response.user)
      toast.success('Регистрация успешна!')
      navigate('/dashboard')
      return response
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка регистрации')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
      setUser(null)
      toast.success('Вы вышли из системы')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isAuthenticated = () => {
    return AuthService.isAuthenticated()
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  }
}
