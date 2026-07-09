import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_INSPECTIONS = [
  { id: 'i1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', inspectorName: 'Super Admin', inspectionDate: '2026-06-16T10:00:00Z', status: 'Completed', odometer: 42300, notes: 'All clear, brakes responsive, engine sounds normal.' },
  { id: 'i2', vehicleId: 'v4', plateNumber: 'HR-26-EE-9912', inspectorName: 'Super Admin', inspectionDate: '2026-06-17T09:15:00Z', status: 'Failed', odometer: 120500, notes: 'Front tires significantly worn below safe depth, brake pad sensor light active.' }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT i.*, v.plate_number, u.first_name || ' ' || u.last_name as inspector_name 
       FROM inspections i
       JOIN vehicles v ON i.vehicle_id = v.id
       JOIN users u ON i.inspector_id = u.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_INSPECTIONS);
  }
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, odometer, status, notes, responses } = req.body;
  const newInspection = {
    id: `i-${Date.now()}`,
    vehicleId,
    plateNumber: 'DL-3C-AS-1294',
    inspectorName: req.user ? `${req.user.email}` : 'Inspector User',
    inspectionDate: new Date().toISOString(),
    status: status || 'Completed',
    odometer: parseInt(odometer) || 0,
    notes: notes || 'No notes'
  };
  MOCK_INSPECTIONS.push(newInspection);
  return res.status(201).json(newInspection);
});

export default router;
