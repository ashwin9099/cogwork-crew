import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider'

// Mock Supabase
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: mockSignOut,
      getUser: mockGetUser,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange
    }
  }
}))

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' })
  }
})

// Test component that uses useAuth
const TestComponent = () => {
  const { user, session, loading, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="session">{session ? 'has-session' : 'no-session'}</div>
      <button onClick={signOut} data-testid="signout-btn">Sign Out</button>
    </div>
  )
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  })

  it('should provide initial loading state', () => {
    renderWithRouter(<TestComponent />)
    
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('session')).toHaveTextContent('no-session')
  })

  it('should update state when user is authenticated', async () => {
    const mockUser = { id: '1', email: 'test@verto.com' }
    const mockSession = { user: mockUser, access_token: 'token' }

    mockGetSession.mockResolvedValue({ data: { session: mockSession } })

    renderWithRouter(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('test@verto.com')
    expect(screen.getByTestId('session')).toHaveTextContent('has-session')
  })

  it('should handle sign out', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    renderWithRouter(<TestComponent />)

    const signOutButton = screen.getByTestId('signout-btn')
    signOutButton.click()

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledOnce()
    })
  })

  it('should handle sign out error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSignOut.mockResolvedValue({ error: { message: 'Sign out failed' } })

    renderWithRouter(<TestComponent />)

    const signOutButton = screen.getByTestId('signout-btn')
    signOutButton.click()

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', 'Sign out failed')
    })

    consoleErrorSpy.mockRestore()
  })

  it('should redirect to /auth when user signs out', async () => {
    const mockCallback = vi.fn()
    mockOnAuthStateChange.mockImplementation((callback) => {
      mockCallback.mockImplementation(callback)
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })

    renderWithRouter(<TestComponent />)

    // Simulate sign out event
    mockCallback('SIGNED_OUT', null)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth')
    })
  })

  it('should redirect to /employees when user signs in from auth page', async () => {
    const mockCallback = vi.fn()
    mockOnAuthStateChange.mockImplementation((callback) => {
      mockCallback.mockImplementation(callback)
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })

    // Mock location to be /auth
    vi.mocked(vi.importActual('react-router-dom')).useLocation = () => ({ pathname: '/auth' })

    renderWithRouter(<TestComponent />)

    const mockSession = { user: { id: '1', email: 'test@verto.com' } }
    
    // Simulate sign in event
    mockCallback('SIGNED_IN', mockSession)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employees')
    })
  })

  it('should redirect unauthenticated users to /auth', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    renderWithRouter(<TestComponent />)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth')
    })
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
  })
})
