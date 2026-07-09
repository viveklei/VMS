import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRouter from './modules/auth';
import usersRouter from './modules/users';
import vehiclesRouter from './modules/vehicles';
import tripsRouter from './modules/trips';
import fuelRouter from './modules/fuel';
import maintenanceRouter from './modules/maintenance';
import inspectionsRouter from './modules/inspections';
import breakdownsRouter from './modules/breakdowns';
import expensesRouter from './modules/expenses';
import analyticsRouter from './modules/analytics';
import zohoRouter from './modules/zoho';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware security headers and cross-origin controls
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// App Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'LEI FleetOps API', timestamp: new Date().toISOString() });
});

// Routing Registry
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/trips', tripsRouter);
app.use('/fuel', fuelRouter);
app.use('/maintenance', maintenanceRouter);
app.use('/inspections', inspectionsRouter);
app.use('/breakdowns', breakdownsRouter);
app.use('/expenses', expensesRouter);
app.use('/zoho', zohoRouter);

// Analytics and Reports mapping
app.use('/analytics', analyticsRouter);
// Wire direct endpoints to match requested paths
app.use('/', analyticsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`LEI FleetOps server running on http://localhost:${PORT}`);
});

export default app;
