import { PrismaClient, Employee, CheckIn } from '@prisma/client';
import { CreateCheckInDTO, CreateCheckOutDTO, CreateEmployeeDTO, GetEmployeesDTO } from '../dtos/employees.dto';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Function to format duration in hours, minutes, and seconds
function formatDuration(durationInMilliseconds: number): string {
  const hours = Math.floor(durationInMilliseconds / 3600000);
  const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((durationInMilliseconds % 60000) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

// Function to create a new employee
export async function createEmployee(dto: CreateEmployeeDTO): Promise<Employee> {
  const { name, firstName, department } = dto;
  return await prisma.employee.create({
    data: {
      name,
      firstName,
      dateCreated: new Date(),
      department,
    },
  });
}

// Function to get employees with an optional dateCreated filter
export async function getEmployees(dto: GetEmployeesDTO): Promise<Employee[]> {
  const { dateCreated } = dto;
  let whereClause = {};

  if (dateCreated) {
    whereClause = {
      dateCreated: {
        gte: new Date(dateCreated),
      },
    };
  }

  return await prisma.employee.findMany({
    where: whereClause,
  });
}

// Function to create a check-in record for an employee
export async function createCheckIn(dto: CreateCheckInDTO): Promise<CheckIn> {
  const { employeeId } = dto;

  return await prisma.checkIn.create({
    data: {
      employee: { connect: { id: employeeId } },
      checkIn: new Date(),
    },
  });
}

// Function to create a check-out record for an employee and calculate duration
export async function createCheckOut(dto: CreateCheckOutDTO): Promise<CheckIn> {
  const { employeeId } = dto;

  // Find the last active check-in record for the employee
  const lastCheckIn = await prisma.checkIn.findFirst({
    where: {
      employeeId: employeeId,
      checkOut: null,
    },
    orderBy: {
      checkIn: 'desc',
    },
  });

  if (!lastCheckIn) {
    throw new Error('No active check-in found for this employee');
  }

  // Calculate the duration between check-in and check-out
  const checkInTime = lastCheckIn.checkIn;
  const checkOutTime = new Date();
  const duration = checkOutTime.getTime() - checkInTime.getTime();

  // Update the check-out time and duration fields of the last check-in record
  return await prisma.checkIn.update({
    where: { id: lastCheckIn.id },
    data: { checkOut: checkOutTime, duration },
  });
}

// Function to get an employee with check-in records, including formatted duration
export async function getEmployeeCheckIns(employeeId: number): Promise<Employee | null> {
  try {
    const employeeWithCheckIns = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        checkIns: true,
      },
    });

    if (!employeeWithCheckIns) {
      return null;
    }

    // Format the duration for each check-in record
    const checkInsWithFormattedDuration = employeeWithCheckIns.checkIns.map((checkIn) => ({
      ...checkIn,
      formattedDuration: checkIn.duration ? formatDuration(checkIn.duration) : null,
    }));

    employeeWithCheckIns.checkIns = checkInsWithFormattedDuration;

    return employeeWithCheckIns;
  } catch (error) {
    throw error;
  }
}
