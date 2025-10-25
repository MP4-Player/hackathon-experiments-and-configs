import { apiService } from './api'
import { AuthUser, LoginCredentials, RegisterData } from '@/types'

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken'
  private static readonly USER_KEY = 'user'

  static async login(credentials: LoginCredentials) {
    const response = await apiService.login(credentials)
    this.setToken(response.token)
    this.setUser(response.user)
    return response
  }

  static async register(data: RegisterData) {
    const response = await apiService.register(data)
    this.setToken(response.token)
    this.setUser(response.user)
    return response
  }

  static async logout() {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuth()
    }
  }

  static setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setUser(user: AuthUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  static getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }
}
