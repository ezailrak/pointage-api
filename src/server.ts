// src/server.ts
import express, { Router, Request, Response } from 'express';
import { PrismaClient, Employee, CheckIn } from '@prisma/client';
import employeesRoutes from './routes/employees.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', employeesRoutes);

// Server startup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
