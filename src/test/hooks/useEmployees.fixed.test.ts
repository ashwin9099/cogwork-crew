import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/useEmployees'
import { CreateEmployeeRequest } from '@/types/employee'
import React from 'react'

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('Employee Hooks - Fixed Tests', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('useEmployees', () => {
    it('should fetch employees successfully', async () => {
      const { result } = renderHook(() => useEmployees(), { wrapper })

      // Initially loading
      expect(result.current.isLoading).toBe(true)

      // Wait for success
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 10000 })

      expect(result.current.data).toBeDefined()
      expect(Array.isArray(result.current.data)).toBe(true)
      expect(result.current.data?.length).toBe(3)
    })

    it('should return correct employee data structure', async () => {
      const { result } = renderHook(() => useEmployees(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 10000 })

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

        // Check specific values
        expect(employee.name).toBe('John Doe')
        expect(employee.employee_id).toBe('EMP001')
        expect(employee.email).toBe('john.doe@verto.com')
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

      result.current.mutate(newEmployee)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 10000 })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe(newEmployee.name)
      expect(result.current.data?.email).toBe(newEmployee.email)
      expect(result.current.data?.id).toBeDefined()
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

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 10000 })

      expect(result.current.data?.name).toBe(updateData.name)
      expect(result.current.data?.position).toBe(updateData.position)
    })
  })

  describe('useDeleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      const { result } = renderHook(() => useDeleteEmployee(), { wrapper })

      result.current.mutate('1')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 10000 })

      expect(result.current.error).toBe(null)
    })
  })
})
