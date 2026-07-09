import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_TRIPS = [
  { id: 't1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', driverName: 'Amit Kumar', customer: 'Samsung Service Center', origin: 'Delhi HQ', destination: 'Noida Sec 62', status: 'Completed', startTime: '2026-06-16T08:00:00Z', endTime: '2026-06-16T12:00:00Z', startOdometer: 42200, endOdometer: 42280 },
  { id: 't2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', driverName: 'Suresh Patil', customer: 'L&T Project Site', origin: 'Mumbai Branch', destination: 'Pune Chinchwad', status: 'Active', startTime: '2026-06-17T05:30:00Z', endTime: null, startOdometer: 78450, endOdometer: null }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT t.*, v.plate_number, d.license_number, c.name as customer 
       FROM trips t
       JOIN vehicles v ON t.vehicle_id = v.id
       JOIN drivers d ON t.driver_id = d.id
       LEFT JOIN trip_customers c ON t.customer_id = c.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_TRIPS);
  }
});

router.post('/start', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, driverId, startOdometer, purpose, customerName, origin, destination } = req.body;
  const newTrip = {
    id: `t-${Date.now()}`,
    vehicleId,
    plateNumber: 'DL-3C-AS-1294', // placeholder or look up
    driverName: 'Amit Kumar',
    customer: customerName || 'LEI Client',
    origin: origin || 'Delhi Office',
    destination: destination || 'Customer Hub',
    status: 'Active',
    startTime: new Date().toISOString(),
    endTime: null,
    startOdometer: parseInt(startOdometer) || 0,
    endOdometer: null
  };
  MOCK_TRIPS.push(newTrip);
  return res.status(201).json(newTrip);
});

router.post('/end', authenticateJWT, authorizePermission('Update'), async (req: AuthenticatedRequest, res: Response) => {
  const { tripId, endOdometer } = req.body;
  const trip = MOCK_TRIPS.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'Completed';
    trip.endTime = new Date().toISOString();
    trip.endOdometer = parseInt(endOdometer);
    return res.json(trip);
  }
  return res.status(404).json({ message: 'Trip not found or already completed.' });
});

export default router;
