import { describe, it, expect, beforeEach } from 'vitest'
import { server } from './server'
import { http, HttpResponse } from 'msw'

describe('Mock Server', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it('should be properly configured', () => {
    expect(server).toBeDefined()
  })

  it('should handle GET requests to employees endpoint', async () => {
    const response = await fetch('/rest/v1/employees')
    expect(response.ok).toBe(true)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(3)
    
    // Check first employee structure
    const firstEmployee = data[0]
    expect(firstEmployee).toHaveProperty('id')
    expect(firstEmployee).toHaveProperty('employee_id')
    expect(firstEmployee).toHaveProperty('name')
    expect(firstEmployee).toHaveProperty('email')
    expect(firstEmployee).toHaveProperty('position')
  })

  it('should handle POST requests to create employees', async () => {
    const newEmployee = {
      employee_id: 'EMP999',
      name: 'Test Employee',
      email: 'test@verto.com',
      position: 'Test Engineer'
    }

    const response = await fetch('/rest/v1/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    })

    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.name).toBe(newEmployee.name)
    expect(data.email).toBe(newEmployee.email)
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('created_at')
  })

  it('should handle validation errors for invalid employee data', async () => {
    const invalidEmployee = {
      employee_id: '',
      name: '',
      email: '',
      position: ''
    }

    const response = await fetch('/rest/v1/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidEmployee)
    })

    expect(response.status).toBe(400)
  })

  it('should handle duplicate employee_id conflicts', async () => {
    const duplicateEmployee = {
      employee_id: 'EMP001', // This already exists in mock data
      name: 'Duplicate Employee',
      email: 'duplicate@verto.com',
      position: 'Test Engineer'
    }

    const response = await fetch('/rest/v1/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicateEmployee)
    })

    expect(response.status).toBe(409)
  })

  it('should reset data when requested', async () => {
    // First, create a new employee
    const newEmployee = {
      employee_id: 'EMP999',
      name: 'Test Employee',
      email: 'test@verto.com',
      position: 'Test Engineer'
    }

    await fetch('/rest/v1/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    })

    // Verify it was added
    let response = await fetch('/rest/v1/employees')
    let data = await response.json()
    expect(data.length).toBe(4)

    // Reset data
    await fetch('/test/reset', { method: 'POST' })

    // Verify data was reset
    response = await fetch('/rest/v1/employees')
    data = await response.json()
    expect(data.length).toBe(3)
  })
})
