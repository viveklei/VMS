import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_BREAKDOWNS = [
  { id: 'b1', vehicleId: 'v4', plateNumber: 'HR-26-EE-9912', driverName: 'Amit Kumar', reportedAt: '2026-06-17T06:12:00Z', location: 'NH-48 Highway, Near Manesar Toll', description: 'Engine overheated, thick coolant vapor escaping from the radiator cap.', status: 'Reported', severity: 'Critical', resolutionNotes: null }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT b.*, v.plate_number, d.license_number 
       FROM breakdowns b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN drivers d ON b.driver_id = d.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_BREAKDOWNS);
  }
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, location, description, severity } = req.body;
  const newBreakdown = {
    id: `b-${Date.now()}`,
    vehicleId,
    plateNumber: 'HR-26-EE-9912',
    driverName: 'Amit Kumar',
    reportedAt: new Date().toISOString(),
    location: location || 'Unknown Location',
    description: description || 'No description provided.',
    status: 'Reported',
    severity: severity || 'Medium',
    resolutionNotes: null
  };
  MOCK_BREAKDOWNS.push(newBreakdown);
  return res.status(201).json(newBreakdown);
});

router.put('/:id/resolve', authenticateJWT, authorizePermission('Update'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { resolutionNotes } = req.body;
  const breakdown = MOCK_BREAKDOWNS.find(b => b.id === id);
  if (breakdown) {
    breakdown.status = 'Resolved';
    breakdown.resolutionNotes = resolutionNotes || 'Issue resolved.';
    return res.json(breakdown);
  }
  return res.status(404).json({ message: 'Breakdown record not found' });
});

export default router;
