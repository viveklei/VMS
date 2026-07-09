import { Router, Request, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Executive KPIs + Fleet Intelligence Metrics
router.get('/dashboard', authenticateJWT, authorizePermission('Read'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    kpis: {
      totalVehicles: 240,
      activeVehicles: 198,
      tripsToday: 45,
      distanceTravelled: 12450, // in km
      fleetUtilization: 82.5, // %
      fuelCost: 145200, // INR
      maintenanceCost: 98400, // INR
      fleetHealthScore: 89.2, // out of 100
      breakdowns: 3,
      upcomingRenewals: 7
    },
    vehiclePerformanceIndex: [
      { plateNumber: 'DL-3C-AS-1294', score: 12.08, label: 'distance / maintenance' },
      { plateNumber: 'MH-12-PQ-8830', score: 9.57, label: 'distance / maintenance' }
    ],
    vehicleHealthScores: [
      { plateNumber: 'DL-3C-AS-1294', score: 92.5, status: 'Healthy' },
      { plateNumber: 'MH-12-PQ-8830', score: 88.0, status: 'Healthy' },
      { plateNumber: 'KA-03-MM-4112', score: 95.0, status: 'Healthy' },
      { plateNumber: 'HR-26-EE-9912', score: 45.0, status: 'Critical' }
    ],
    trends: {
      usage: [
        { name: 'Mon', distance: 1200 },
        { name: 'Tue', distance: 1500 },
        { name: 'Wed', distance: 1800 },
        { name: 'Thu', distance: 1600 },
        { name: 'Fri', distance: 2100 },
        { name: 'Sat', distance: 900 },
        { name: 'Sun', distance: 400 }
      ],
      fuel: [
        { name: 'Week 1', cost: 35000 },
        { name: 'Week 2', cost: 42000 },
        { name: 'Week 3', cost: 38000 },
        { name: 'Week 4', cost: 45200 }
      ],
      expenses: [
        { name: 'Fuel', value: 160200 },
        { name: 'Maintenance', value: 98400 },
        { name: 'Toll', value: 18500 },
        { name: 'Driver Allowance', value: 45000 }
      ]
    }
  });
});

router.get('/fleet-health', authenticateJWT, authorizePermission('Read'), (req: AuthenticatedRequest, res: Response) => {
  res.json([
    { status: 'Good', percentage: 75 },
    { status: 'Warning', percentage: 15 },
    { status: 'Critical', percentage: 10 }
  ]);
});

router.get('/utilization', authenticateJWT, authorizePermission('Read'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    utilizationRate: 82.5,
    availableDays: 30,
    activeDays: 25
  });
});

// Reports endpoints
router.get('/reports/fleet', authenticateJWT, authorizePermission('Export'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    reportType: 'Fleet Report',
    exportedAt: new Date().toISOString(),
    data: [
      { plateNumber: 'DL-3C-AS-1294', department: 'Service Eng', status: 'Active', utilization: '88%' },
      { plateNumber: 'MH-12-PQ-8830', department: 'Sales Ops', status: 'Active', utilization: '92%' }
    ]
  });
});

router.get('/reports/fuel', authenticateJWT, authorizePermission('Export'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    reportType: 'Fuel Report',
    exportedAt: new Date().toISOString(),
    data: [
      { month: 'June 2026', totalLiters: 1500, averageEfficiency: '14.2 km/l', totalCost: 145200 }
    ]
  });
});

router.get('/reports/expenses', authenticateJWT, authorizePermission('Export'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    reportType: 'Expense Report',
    exportedAt: new Date().toISOString(),
    data: [
      { category: 'Fuel', amount: 145200, count: 48 },
      { category: 'Maintenance', amount: 98400, count: 12 },
      { category: 'Toll', amount: 18500, count: 62 }
    ]
  });
});

export default router;
