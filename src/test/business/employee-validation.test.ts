import { describe, it, expect } from 'vitest'
import { Employee, CreateEmployeeRequest } from '@/types/employee'

// Business logic validation functions
export const validateEmployeeData = (employee: CreateEmployeeRequest): string[] => {
  const errors: string[] = []

  // Required field validation
  if (!employee.employee_id?.trim()) {
    errors.push('Employee ID is required')
  }

  if (!employee.name?.trim()) {
    errors.push('Name is required')
  }

  if (!employee.email?.trim()) {
    errors.push('Email is required')
  }

  if (!employee.position?.trim()) {
    errors.push('Position is required')
  }

  // Format validation
  if (employee.employee_id && !/^EMP\d{3,}$/.test(employee.employee_id)) {
    errors.push('Employee ID must follow format EMP### (e.g., EMP001)')
  }

  if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    errors.push('Email must be a valid email address')
  }

  if (employee.name && employee.name.length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (employee.name && employee.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }

  if (employee.position && employee.position.length < 2) {
    errors.push('Position must be at least 2 characters long')
  }

  return errors
}

export const validateEmployeeUpdate = (updates: Partial<Employee>): string[] => {
  const errors: string[] = []

  // Only validate fields that are being updated
  if (updates.employee_id !== undefined) {
    if (!updates.employee_id?.trim()) {
      errors.push('Employee ID cannot be empty')
    } else if (!/^EMP\d{3,}$/.test(updates.employee_id)) {
      errors.push('Employee ID must follow format EMP### (e.g., EMP001)')
    }
  }

  if (updates.name !== undefined) {
    if (!updates.name?.trim()) {
      errors.push('Name cannot be empty')
    } else if (updates.name.length < 2) {
      errors.push('Name must be at least 2 characters long')
    } else if (updates.name.length > 100) {
      errors.push('Name must be less than 100 characters')
    }
  }

  if (updates.email !== undefined) {
    if (!updates.email?.trim()) {
      errors.push('Email cannot be empty')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      errors.push('Email must be a valid email address')
    }
  }

  if (updates.position !== undefined) {
    if (!updates.position?.trim()) {
      errors.push('Position cannot be empty')
    } else if (updates.position.length < 2) {
      errors.push('Position must be at least 2 characters long')
    }
  }

  return errors
}

export const checkDuplicateEmployeeId = (employees: Employee[], employeeId: string, excludeId?: string): boolean => {
  return employees.some(emp => emp.employee_id === employeeId && emp.id !== excludeId)
}

export const checkDuplicateEmail = (employees: Employee[], email: string, excludeId?: string): boolean => {
  return employees.some(emp => emp.email === email && emp.id !== excludeId)
}

describe('Employee Business Logic Validation', () => {
  describe('validateEmployeeData', () => {
    it('should pass validation for valid employee data', () => {
      const validEmployee: CreateEmployeeRequest = {
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@verto.com',
        position: 'Software Engineer'
      }

      const errors = validateEmployeeData(validEmployee)
      expect(errors).toHaveLength(0)
    })

    it('should fail validation for missing required fields', () => {
      const invalidEmployee: CreateEmployeeRequest = {
        employee_id: '',
        name: '',
        email: '',
        position: ''
      }

      const errors = validateEmployeeData(invalidEmployee)
      expect(errors).toContain('Employee ID is required')
      expect(errors).toContain('Name is required')
      expect(errors).toContain('Email is required')
      expect(errors).toContain('Position is required')
    })

    it('should fail validation for invalid employee ID format', () => {
      const invalidEmployee: CreateEmployeeRequest = {
        employee_id: 'INVALID',
        name: 'John Doe',
        email: 'john.doe@verto.com',
        position: 'Software Engineer'
      }

      const errors = validateEmployeeData(invalidEmployee)
      expect(errors).toContain('Employee ID must follow format EMP### (e.g., EMP001)')
    })

    it('should fail validation for invalid email format', () => {
      const invalidEmployee: CreateEmployeeRequest = {
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'invalid-email',
        position: 'Software Engineer'
      }

      const errors = validateEmployeeData(invalidEmployee)
      expect(errors).toContain('Email must be a valid email address')
    })

    it('should fail validation for name length constraints', () => {
      const shortName: CreateEmployeeRequest = {
        employee_id: 'EMP001',
        name: 'A',
        email: 'john.doe@verto.com',
        position: 'Software Engineer'
      }

      const longName: CreateEmployeeRequest = {
        employee_id: 'EMP001',
        name: 'A'.repeat(101),
        email: 'john.doe@verto.com',
        position: 'Software Engineer'
      }

      expect(validateEmployeeData(shortName)).toContain('Name must be at least 2 characters long')
      expect(validateEmployeeData(longName)).toContain('Name must be less than 100 characters')
    })
  })

  describe('validateEmployeeUpdate', () => {
    it('should pass validation for valid partial updates', () => {
      const validUpdate = {
        name: 'Updated Name',
        position: 'Senior Engineer'
      }

      const errors = validateEmployeeUpdate(validUpdate)
      expect(errors).toHaveLength(0)
    })

    it('should fail validation for empty fields in update', () => {
      const invalidUpdate = {
        name: '',
        email: ''
      }

      const errors = validateEmployeeUpdate(invalidUpdate)
      expect(errors).toContain('Name cannot be empty')
      expect(errors).toContain('Email cannot be empty')
    })

    it('should allow partial updates without validating unspecified fields', () => {
      const partialUpdate = {
        name: 'Valid Name'
      }

      const errors = validateEmployeeUpdate(partialUpdate)
      expect(errors).toHaveLength(0)
    })
  })

  describe('checkDuplicateEmployeeId', () => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john@verto.com',
        position: 'Engineer',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        employee_id: 'EMP002',
        name: 'Jane Smith',
        email: 'jane@verto.com',
        position: 'Manager',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ]

    it('should detect duplicate employee ID', () => {
      const isDuplicate = checkDuplicateEmployeeId(mockEmployees, 'EMP001')
      expect(isDuplicate).toBe(true)
    })

    it('should not detect duplicate when employee ID is unique', () => {
      const isDuplicate = checkDuplicateEmployeeId(mockEmployees, 'EMP999')
      expect(isDuplicate).toBe(false)
    })

    it('should exclude specified ID when checking for duplicates', () => {
      const isDuplicate = checkDuplicateEmployeeId(mockEmployees, 'EMP001', '1')
      expect(isDuplicate).toBe(false)
    })
  })

  describe('checkDuplicateEmail', () => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john@verto.com',
        position: 'Engineer',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        employee_id: 'EMP002',
        name: 'Jane Smith',
        email: 'jane@verto.com',
        position: 'Manager',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ]

    it('should detect duplicate email', () => {
      const isDuplicate = checkDuplicateEmail(mockEmployees, 'john@verto.com')
      expect(isDuplicate).toBe(true)
    })

    it('should not detect duplicate when email is unique', () => {
      const isDuplicate = checkDuplicateEmail(mockEmployees, 'new@verto.com')
      expect(isDuplicate).toBe(false)
    })

    it('should exclude specified ID when checking for duplicates', () => {
      const isDuplicate = checkDuplicateEmail(mockEmployees, 'john@verto.com', '1')
      expect(isDuplicate).toBe(false)
    })
  })
})
