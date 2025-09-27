export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  position: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  employee_id: string;
  name: string;
  email: string;
  position: string;
}

export interface UpdateEmployeeRequest {
  employee_id?: string;
  name?: string;
  email?: string;
  position?: string;
}