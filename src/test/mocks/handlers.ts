import { http, HttpResponse } from 'msw'
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

export const handlers = [
  // GET /employees - Fetch all employees
  http.get('*/rest/v1/employees', () => {
    return HttpResponse.json(employees)
  }),

  // GET /employees/:id - Fetch single employee
  http.get('*/rest/v1/employees/:id', ({ params }) => {
    const { id } = params
    const employee = employees.find(emp => emp.id === id)
    
    if (!employee) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(employee)
  }),

  // POST /employees - Create new employee
  http.post('*/rest/v1/employees', async ({ request }) => {
    const newEmployee = await request.json() as Omit<Employee, 'id' | 'created_at' | 'updated_at'>
    
    // Validate required fields
    if (!newEmployee.employee_id || !newEmployee.name || !newEmployee.email || !newEmployee.position) {
      return new HttpResponse(null, { status: 400 })
    }

    // Check for duplicate employee_id
    if (employees.some(emp => emp.employee_id === newEmployee.employee_id)) {
      return new HttpResponse(null, { status: 409 })
    }

    // Check for duplicate email
    if (employees.some(emp => emp.email === newEmployee.email)) {
      return new HttpResponse(null, { status: 409 })
    }

    const employee: Employee = {
      ...newEmployee,
      id: String(employees.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    employees.push(employee)
    return HttpResponse.json(employee, { status: 201 })
  }),

  // PUT /employees/:id - Update employee
  http.patch('*/rest/v1/employees', async ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const updates = await request.json() as Partial<Employee>

    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const employeeIndex = employees.findIndex(emp => emp.id === id)
    
    if (employeeIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    // Check for duplicate employee_id (if being updated)
    if (updates.employee_id && employees.some(emp => emp.employee_id === updates.employee_id && emp.id !== id)) {
      return new HttpResponse(null, { status: 409 })
    }

    // Check for duplicate email (if being updated)
    if (updates.email && employees.some(emp => emp.email === updates.email && emp.id !== id)) {
      return new HttpResponse(null, { status: 409 })
    }

    employees[employeeIndex] = {
      ...employees[employeeIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }

    return HttpResponse.json(employees[employeeIndex])
  }),

  // DELETE /employees/:id - Delete employee
  http.delete('*/rest/v1/employees', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const employeeIndex = employees.findIndex(emp => emp.id === id)
    
    if (employeeIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    employees.splice(employeeIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Reset mock data (for testing purposes)
  http.post('*/test/reset', () => {
    employees = [...mockEmployees]
    return HttpResponse.json({ message: 'Data reset successfully' })
  })
]
