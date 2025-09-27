import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { EmployeeTable } from '@/components/employees/EmployeeTable'

// Mock the auth provider
const mockSignOut = vi.fn()
const mockUser = {
  id: '1',
  email: 'test@verto.com'
}

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: mockUser,
    signOut: mockSignOut
  })
}))

describe('EmployeeTable Component - Improved Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render and load employee data successfully', async () => {
    render(<EmployeeTable />)

    // Check initial loading state
    expect(screen.getByText('Loading employees...')).toBeInTheDocument()

    // Wait for data to load and check all employees are present
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Verify all mock employees are displayed
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    
    // Verify employee details
    expect(screen.getByText('EMP001')).toBeInTheDocument()
    expect(screen.getByText('john.doe@verto.com')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('should handle search functionality correctly', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    // Wait for initial data load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    
    // Test search filtering
    await user.type(searchInput, 'Jane')
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    // Test search clearing
    await user.clear(searchInput)
    
    // Use a more flexible approach to wait for all employees to return
    await waitFor(() => {
      const employeeRows = screen.getAllByRole('row')
      // Should have header row + 3 employee rows = 4 total
      expect(employeeRows.length).toBeGreaterThan(3)
    }, { timeout: 10000 })

    // Verify all employees are back
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('should show no results message for invalid search', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    await user.type(searchInput, 'NonExistentEmployee')

    await waitFor(() => {
      expect(screen.getByText('No employees found matching your search.')).toBeInTheDocument()
    })
  })

  it('should display correct employee count', async () => {
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('Employees (3)')).toBeInTheDocument()
    }, { timeout: 10000 })
  })

  it('should handle user interactions correctly', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Test sign out button
    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)
    expect(mockSignOut).toHaveBeenCalledOnce()

    // Test add employee button
    const addButton = screen.getByText('Add Employee')
    expect(addButton).toBeInTheDocument()
    await user.click(addButton)
    // Form opening would be tested separately in EmployeeForm tests
  })

  it('should show action buttons for each employee', async () => {
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Find all table rows (excluding header)
    const tableBody = screen.getByRole('table').querySelector('tbody')
    expect(tableBody).toBeInTheDocument()

    if (tableBody) {
      const rows = within(tableBody).getAllByRole('row')
      expect(rows.length).toBe(3) // Should have 3 employee rows

      // Each row should have edit and delete buttons
      rows.forEach(row => {
        const buttons = within(row).getAllByRole('button')
        expect(buttons.length).toBe(2) // Edit and Delete buttons
      })
    }
  })

  it('should handle delete confirmation dialog', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Find the first delete button (trash icon)
    const tableBody = screen.getByRole('table').querySelector('tbody')
    if (tableBody) {
      const firstRow = within(tableBody).getAllByRole('row')[0]
      const buttons = within(firstRow).getAllByRole('button')
      const deleteButton = buttons[1] // Assuming delete is the second button

      await user.click(deleteButton)

      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      })

      expect(screen.getByText('This action cannot be undone')).toBeInTheDocument()
    }
  })
})
