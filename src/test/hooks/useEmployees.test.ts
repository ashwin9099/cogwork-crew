import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/useEmployees'
import { Employee, CreateEmployeeRequest } from '@/types/employee'

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Employee CRUD Hooks', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('useEmployees', () => {
    it('should fetch employees successfully', async () => {
      const { result } = renderHook(() => useEmployees(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(Array.isArray(result.current.data)).toBe(true)
      expect(result.current.data?.length).toBeGreaterThan(0)
    })

    it('should return employee data with correct structure', async () => {
      const { result } = renderHook(() => useEmployees(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const employees = result.current.data
      expect(employees).toBeDefined()
      
      if (employees && employees.length > 0) {
        const employee = employees[0]
        expect(employee).toHaveProperty('id')
        expect(employee).toHaveProperty('employee_id')
        expect(employee).toHaveProperty('name')
        expect(employee).toHaveProperty('email')
        expect(employee).toHaveProperty('position')
        expect(employee).toHaveProperty('created_at')
        expect(employee).toHaveProperty('updated_at')
      }
    })
  })

  describe('useCreateEmployee', () => {
    it('should create a new employee successfully', async () => {
      const { result } = renderHook(() => useCreateEmployee(), { wrapper })

      const newEmployee: CreateEmployeeRequest = {
        employee_id: 'EMP999',
        name: 'Test Employee',
        email: 'test@verto.com',
        position: 'Test Engineer'
      }

      await waitFor(() => {
        result.current.mutate(newEmployee)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe(newEmployee.name)
      expect(result.current.data?.email).toBe(newEmployee.email)
    })

    it('should handle validation errors', async () => {
      const { result } = renderHook(() => useCreateEmployee(), { wrapper })

      const invalidEmployee = {
        employee_id: '',
        name: '',
        email: 'invalid-email',
        position: ''
      } as CreateEmployeeRequest

      await waitFor(() => {
        result.current.mutate(invalidEmployee)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('should handle duplicate employee_id', async () => {
      const { result } = renderHook(() => useCreateEmployee(), { wrapper })

      const duplicateEmployee: CreateEmployeeRequest = {
        employee_id: 'EMP001', // This already exists in mock data
        name: 'Duplicate Employee',
        email: 'duplicate@verto.com',
        position: 'Test Engineer'
      }

      await waitFor(() => {
        result.current.mutate(duplicateEmployee)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useUpdateEmployee', () => {
    it('should update an employee successfully', async () => {
      const { result } = renderHook(() => useUpdateEmployee(), { wrapper })

      const updateData = {
        id: '1',
        name: 'Updated Name',
        position: 'Senior Engineer'
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.name).toBe(updateData.name)
      expect(result.current.data?.position).toBe(updateData.position)
    })

    it('should handle non-existent employee update', async () => {
      const { result } = renderHook(() => useUpdateEmployee(), { wrapper })

      const updateData = {
        id: '999',
        name: 'Non-existent Employee'
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('should handle duplicate email update', async () => {
      const { result } = renderHook(() => useUpdateEmployee(), { wrapper })

      const updateData = {
        id: '1',
        email: 'jane.smith@verto.com' // This email belongs to employee with id '2'
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useDeleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      const { result } = renderHook(() => useDeleteEmployee(), { wrapper })

      await waitFor(() => {
        result.current.mutate('1')
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should handle non-existent employee deletion', async () => {
      const { result } = renderHook(() => useDeleteEmployee(), { wrapper })

      await waitFor(() => {
        result.current.mutate('999')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('should handle invalid employee ID', async () => {
      const { result } = renderHook(() => useDeleteEmployee(), { wrapper })

      await waitFor(() => {
        result.current.mutate('')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
