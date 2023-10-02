import express, { Router, Request, Response } from 'express';
import { PrismaClient, Employee, CheckIn } from '@prisma/client';
import { CreateEmployeeDTO, GetEmployeesDTO, CreateCheckInDTO, CreateCheckOutDTO } from '../dtos/employees.dto';
import * as employeesModels from '../models/employees.models';

const router = Router();
const prisma = new PrismaClient();

// Endpoint to get the list of employees with a dateCreated filter
router.get('/employees', async (req: Request, res: Response) => {
  const getEmployeesDTO: GetEmployeesDTO = req.query;

  try {
    const employees = await employeesModels.getEmployees(getEmployeesDTO);
    res.json(employees);
  } catch (error) {
    console.error('Error while retrieving employees:', error);
    res.status(500).json({ error: 'Error while retrieving employees' });
  }
});

// Endpoint to create a new employee
router.post('/employees', async (req: Request, res: Response) => {
  const createEmployeeDTO: CreateEmployeeDTO = req.body;

  try {
    const newEmployee = await employeesModels.createEmployee(createEmployeeDTO);
    res.json(newEmployee);
  } catch (error) {
    console.error('Error while creating employee:', error);
    res.status(500).json({ error: 'Error while creating employee' });
  }
});

// Endpoint for employee check-in or adding comments to a check-in
router.post('/check-in', async (req: Request, res: Response) => {
  const createCheckInDTO: CreateCheckInDTO = req.body;

  try {
    const checkIn = await employeesModels.createCheckIn(createCheckInDTO);
    res.json(checkIn);
  } catch (error) {
    console.error('Error during check-in creation:', error);
    res.status(500).json({ error: 'Error during check-in creation' });
  }
});

// Endpoint for employee check-out
router.post('/check-out', async (req: Request, res: Response) => {
  const createCheckOutDTO: CreateCheckOutDTO = req.body;

  try {
    const checkOut = await employeesModels.createCheckOut(createCheckOutDTO);
    res.json(checkOut);
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ error: 'Error during check-out' });
  }
});

// Endpoint to get employee check-ins by employeeId
router.get('/employee/:employeeId/checkins', async (req: Request, res: Response) => {
  const { employeeId } = req.params;

  try {
    const employeeWithCheckIns = await employeesModels.getEmployeeCheckIns(parseInt(employeeId, 10));

    if (!employeeWithCheckIns) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employeeWithCheckIns);
  } catch (error) {
    console.error('Error while retrieving employee check-ins:', error);
    res.status(500).json({ error: 'Error while retrieving employee check-ins' });
  }
});

export default router;
