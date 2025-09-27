import { vi } from 'vitest'
import { Employee } from '@/types/employee'

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@verto.com',
    position: 'Software Engineer',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    employee_id: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@verto.com',
    position: 'Product Manager',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    employee_id: 'EMP003',
    name: 'Bob Johnson',
    email: 'bob.johnson@verto.com',
    position: 'Designer',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  }
]

let employees = [...mockEmployees]

// Mock Supabase client
export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => Promise.resolve({ data: employees, error: null })),
      eq: vi.fn(() => ({
        single: vi.fn(() => {
          const employee = employees[0] // Return first employee for simplicity
          return Promise.resolve({ data: employee, error: null })
        })
      }))
    })),
    insert: vi.fn((newEmployees) => ({
      select: vi.fn(() => ({
        single: vi.fn(() => {
          const newEmployee = Array.isArray(newEmployees) ? newEmployees[0] : newEmployees
          const employee: Employee = {
            ...newEmployee,
            id: String(employees.length + 1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          employees.push(employee)
          return Promise.resolve({ data: employee, error: null })
        })
      }))
    })),
    update: vi.fn((updates) => ({
      eq: vi.fn((field, value) => ({
        select: vi.fn(() => ({
          single: vi.fn(() => {
            const index = employees.findIndex(emp => emp.id === value)
            if (index !== -1) {
              employees[index] = { ...employees[index], ...updates, updated_at: new Date().toISOString() }
              return Promise.resolve({ data: employees[index], error: null })
            }
            return Promise.resolve({ data: null, error: { message: 'Employee not found' } })
          })
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn((field, value) => {
        const index = employees.findIndex(emp => emp.id === value)
        if (index !== -1) {
          employees.splice(index, 1)
          return Promise.resolve({ error: null })
        }
        return Promise.resolve({ error: { message: 'Employee not found' } })
      })
    }))
  })),
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ error: null })),
    signInWithPassword: vi.fn(() => Promise.resolve({ error: null })),
    signUp: vi.fn(() => Promise.resolve({ error: null }))
  }
}

// Reset function for tests
export const resetMockData = () => {
  employees = [...mockEmployees]
}
