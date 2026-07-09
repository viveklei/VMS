import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_FUEL = [
  { id: 'f1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', driverName: 'Amit Kumar', date: '2026-06-15', odometer: 42100, liters: 30.00, pricePerLiter: 96.50, totalCost: 2895.00, vendor: 'Indian Oil Sec 63', status: 'Approved' },
  { id: 'f2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', driverName: 'Suresh Patil', date: '2026-06-16', odometer: 78400, liters: 50.00, pricePerLiter: 104.20, totalCost: 5210.00, vendor: 'HP Pump Pune', status: 'Pending' }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT f.*, v.plate_number, d.license_number 
       FROM fuel_entries f
       JOIN vehicles v ON f.vehicle_id = v.id
       JOIN drivers d ON f.driver_id = d.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_FUEL);
  }
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, date, odometer, liters, pricePerLiter, vendor } = req.body;
  const newFuel = {
    id: `f-${Date.now()}`,
    vehicleId,
    plateNumber: 'DL-3C-AS-1294',
    driverName: 'Amit Kumar',
    date: date || new Date().toISOString().split('T')[0],
    odometer: parseInt(odometer) || 42500,
    liters: parseFloat(liters) || 10,
    pricePerLiter: parseFloat(pricePerLiter) || 96.50,
    totalCost: (parseFloat(liters) || 10) * (parseFloat(pricePerLiter) || 96.50),
    vendor: vendor || 'HP Petrol Pump',
    status: 'Pending'
  };
  MOCK_FUEL.push(newFuel);
  return res.status(201).json(newFuel);
});

router.put('/:id/approve', authenticateJWT, authorizePermission('Approve'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const fuel = MOCK_FUEL.find(f => f.id === id);
  if (fuel) {
    fuel.status = 'Approved';
    return res.json(fuel);
  }
  return res.status(404).json({ message: 'Fuel entry not found' });
});

export default router;
