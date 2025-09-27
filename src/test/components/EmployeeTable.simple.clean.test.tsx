import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { EmployeeTable } from '@/components/employees/EmployeeTable'

// Mock the auth provider
vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@verto.com' },
    signOut: vi.fn()
  })
}))

describe('EmployeeTable - Clean Simple Tests', () => {
  it('should render the page title', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Verto Employee Management')).toBeInTheDocument()
  })

  it('should render the subtitle', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Manage your team with modern CRUD operations')).toBeInTheDocument()
  })

  it('should show welcome message', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Welcome, test@verto.com')).toBeInTheDocument()
  })

  it('should render sign out button', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('should render add employee button', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Add Employee')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<EmployeeTable />)
    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Loading employees...')).toBeInTheDocument()
  })

  it('should eventually show employee data', async () => {
    render(<EmployeeTable />)

    // Wait for loading to complete and any employee to appear
    await waitFor(() => {
      // Look for any of the mock employee names
      const hasJohn = screen.queryByText('John Doe')
      const hasJane = screen.queryByText('Jane Smith')
      const hasBob = screen.queryByText('Bob Johnson')
      
      // At least one should be present
      expect(hasJohn || hasJane || hasBob).toBeTruthy()
    }, { timeout: 15000 })
  }, 20000) // 20 second test timeout
})
