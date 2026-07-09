import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_MAINTENANCE = [
  { id: 'm1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', serviceType: 'Routine', description: 'Engine Oil and Filter Replacement', cost: 3500.00, odometer: 40000, serviceDate: '2026-05-10', completedDate: '2026-05-10', status: 'Completed', vendorName: 'Tata Authorised Workshop' },
  { id: 'm2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', serviceType: 'Preventive', description: 'Break Pad Check & Suspension Alignment', cost: 8200.00, odometer: 79000, serviceDate: '2026-06-20', completedDate: null, status: 'Scheduled', vendorName: 'Mahindra Service Center' }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT m.*, v.plate_number 
       FROM maintenance_records m
       JOIN vehicles v ON m.vehicle_id = v.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_MAINTENANCE);
  }
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, serviceType, description, cost, odometer, serviceDate, vendorName } = req.body;
  const newRecord = {
    id: `m-${Date.now()}`,
    vehicleId,
    plateNumber: 'DL-3C-AS-1294',
    serviceType: serviceType || 'Preventive',
    description: description || 'General service',
    cost: parseFloat(cost) || 0,
    odometer: parseInt(odometer) || 0,
    serviceDate: serviceDate || new Date().toISOString().split('T')[0],
    completedDate: null,
    status: 'Scheduled',
    vendorName: vendorName || 'Local Service Shop'
  };
  MOCK_MAINTENANCE.push(newRecord);
  return res.status(201).json(newRecord);
});

router.put('/:id/complete', authenticateJWT, authorizePermission('Update'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const record = MOCK_MAINTENANCE.find(m => m.id === id);
  if (record) {
    record.status = 'Completed';
    record.completedDate = new Date().toISOString().split('T')[0];
    return res.json(record);
  }
  return res.status(404).json({ message: 'Maintenance record not found' });
});

export default router;
