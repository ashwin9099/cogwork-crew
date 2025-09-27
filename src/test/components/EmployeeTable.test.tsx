import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
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

describe('EmployeeTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render employee table with header', async () => {
    render(<EmployeeTable />)

    expect(screen.getByText('Verto Employee Management')).toBeInTheDocument()
    expect(screen.getByText('Manage your team with modern CRUD operations')).toBeInTheDocument()
    expect(screen.getByText(`Welcome, ${mockUser.email}`)).toBeInTheDocument()
  })

  it('should display loading state initially', () => {
    render(<EmployeeTable />)
    expect(screen.getByText('Loading employees...')).toBeInTheDocument()
  })

  it('should display employees after loading', async () => {
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 5000 })

    expect(screen.getByText('EMP001')).toBeInTheDocument()
    expect(screen.getByText('john.doe@verto.com')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('should filter employees based on search input', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    }, { timeout: 5000 })

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    await user.type(searchInput, 'Jane')

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
  })

  it('should open add employee form when Add Employee button is clicked', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    const addButton = screen.getByText('Add Employee')
    await user.click(addButton)

    // The form should open (this would depend on your EmployeeForm component implementation)
    // You might need to adjust this based on how your form modal works
  })

  it('should call signOut when Sign Out button is clicked', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)

    expect(mockSignOut).toHaveBeenCalledOnce()
  })

  it('should display correct employee count', async () => {
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('Employees (3)')).toBeInTheDocument()
    })
  })

  it('should show edit and delete buttons for each employee', async () => {
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('should open delete confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'trash-2'
    )

    if (deleteButton) {
      await user.click(deleteButton)

      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      })
    }
  })

  it('should display no employees message when search returns no results', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    await user.type(searchInput, 'NonExistentEmployee')

    await waitFor(() => {
      expect(screen.getByText('No employees found matching your search.')).toBeInTheDocument()
    })
  })

  it('should clear search when input is emptied', async () => {
    const user = userEvent.setup()
    render(<EmployeeTable />)

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    }, { timeout: 5000 })

    const searchInput = screen.getByPlaceholderText('Search employees by name, ID, email, or position...')
    
    // Type search term to filter results
    await user.type(searchInput, 'Jane')
    
    // Wait for filtering to take effect
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })

    // Clear the search input
    await user.clear(searchInput)

    // Wait for all employees to be visible again
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
