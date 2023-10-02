// DTO for creating an employee
export interface CreateEmployeeDTO {
  name: string;
  firstName: string;
  department: string;
}

// DTO for creating a check-in record
export interface CreateCheckInDTO {
  employeeId: number;
}

// DTO for retrieving employees with a filter
export interface GetEmployeesDTO {
  dateCreated?: string;
}

// DTO for creating a check-out record
export interface CreateCheckOutDTO {
  employeeId: number;
}
