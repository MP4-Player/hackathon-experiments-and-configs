import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '../LoginForm'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  it('renders login form elements', () => {
    render(<LoginForm />, { wrapper: createWrapper() })

    expect(screen.getByText('Вход в систему')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Введите email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Введите пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: 'Войти' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email обязателен')).toBeInTheDocument()
      expect(screen.getByText('Пароль обязателен')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })

    const emailInput = screen.getByPlaceholderText('Введите email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const submitButton = screen.getByRole('button', { name: 'Войти' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Неверный формат email')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(<LoginForm />, { wrapper: createWrapper() })

    const passwordInput = screen.getByPlaceholderText('Введите пароль')
    const toggleButton = screen.getByRole('button', { name: '' })

    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
