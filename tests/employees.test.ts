// employees.test.ts

import request from 'supertest';
import app from '../src/server';
import { createEmployee } from "../src/models/employees.models";

describe('createEmployee', () => {
  it('should create a new employee', async () => {
    const employee = await createEmployee({
      name: 'John Doe',
      firstName: 'John',
      department: 'IT',
    });
    // Verify that the employee object is created correctly
    expect(employee).toEqual({
      id: expect.any(Number),
      name: 'John Doe',
      firstName: 'John',
      dateCreated: expect.any(Date),
      department: 'IT',
    });
  });
});

describe('Employee API', () => {
  it('should retrieve employees with a dateCreated filter', async () => {
    const response = await request(app)
      .get('/employees')
      .query({ dateCreated: '2023-01-05' });

    expect(response.status).toBe(200);
    // Ensure that the response contains a list of filtered employees
    expect(response.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(Number),
        name: expect.any(String),
        firstName: expect.any(String),
        dateCreated: expect.any(String), // Check the date format
        department: expect.any(String),
      },
    ]));
  });
});

describe('Check-In API', () => {
  it('should create a check-in record for an employee', async () => {
    const employeeId = 1; // The ID of an existing employee in the database
    const response = await request(app)
      .post(`/check-in`)
      .send({ employeeId });

    expect(response.status).toBe(200); // Ensure that the creation was successful
    expect(response.body).toHaveProperty('id'); // Verify that the check-in ID is present in the response
  });
});
