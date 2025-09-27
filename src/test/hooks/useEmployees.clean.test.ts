import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEmployees } from '@/hooks/useEmployees'
import React from 'react'

describe('Employee Hooks - Clean Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  )

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

  it('should return correct employee data', async () => {
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

      // Check specific values from mock
      expect(employee.name).toBe('John Doe')
      expect(employee.employee_id).toBe('EMP001')
      expect(employee.email).toBe('john.doe@verto.com')
    }
  })
})
