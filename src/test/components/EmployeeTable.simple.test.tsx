import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { EmployeeTable } from '@/components/employees/EmployeeTable'

// Mock the auth provider with a simple implementation
vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@verto.com' },
    signOut: vi.fn()
  })
}))

describe('EmployeeTable - Simple Tests', () => {
  it('should render the main heading', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Verto Employee Management')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Loading employees...')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<EmployeeTable />)
    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should render add employee button', () => {
    render(<EmployeeTable />)
    const addButton = screen.getByText('Add Employee')
    expect(addButton).toBeInTheDocument()
  })

  it('should render sign out button', () => {
    render(<EmployeeTable />)
    const signOutButton = screen.getByText('Sign Out')
    expect(signOutButton).toBeInTheDocument()
  })

  it('should display welcome message with user email', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Welcome, test@verto.com')).toBeInTheDocument()
  })

  it('should eventually load and display employee data', async () => {
    render(<EmployeeTable />)

    // Wait for loading to complete and data to appear
    await waitFor(
      () => {
        // Look for any employee name or use a more flexible approach
        const johnDoe = screen.queryByText('John Doe')
        const janeSmith = screen.queryByText('Jane Smith')
        const bobJohnson = screen.queryByText('Bob Johnson')
        
        // At least one employee should be visible
        expect(johnDoe || janeSmith || bobJohnson).toBeInTheDocument()
      },
      { timeout: 10000 }
    )
  })

  it('should allow typing in search input', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    
    await user.type(searchInput, 'test search')
    expect(searchInput).toHaveValue('test search')
  })

  it('should clear search input when cleared', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    
    await user.type(searchInput, 'test')
    expect(searchInput).toHaveValue('test')
    
    await user.clear(searchInput)
    expect(searchInput).toHaveValue('')
  })
})
