import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_VEHICLES = [
  { id: 'v1', plateNumber: 'DL-3C-AS-1294', make: 'Tata', model: 'Intra V30', year: 2022, category: 'Service Vehicle', branch: 'Delhi HQ', fuelType: 'Diesel', fuelCapacity: 35, odometer: 42350, status: 'Active', healthScore: 92.5 },
  { id: 'v2', plateNumber: 'MH-12-PQ-8830', make: 'Mahindra', model: 'Bolero Pik-Up', year: 2021, category: 'Cargo Truck', branch: 'Mumbai Branch', fuelType: 'Diesel', fuelCapacity: 60, odometer: 78500, status: 'Active', healthScore: 88.0 },
  { id: 'v3', plateNumber: 'KA-03-MM-4112', make: 'Maruti Suzuki', model: 'Super Carry', year: 2023, category: 'Service Vehicle', branch: 'Bengaluru Branch', fuelType: 'CNG', fuelCapacity: 70, odometer: 15400, status: 'In Service', healthScore: 95.0 },
  { id: 'v4', plateNumber: 'HR-26-EE-9912', make: 'Ashok Leyland', model: 'Dost+', year: 2020, category: 'Cargo Truck', branch: 'Gurugram Warehouse', fuelType: 'Diesel', fuelCapacity: 40, odometer: 120500, status: 'Breakdown', healthScore: 45.0 }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT v.*, c.name as category, b.name as branch 
       FROM vehicles v
       LEFT JOIN vehicle_categories c ON v.category_id = c.id
       LEFT JOIN branches b ON v.branch_id = b.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_VEHICLES);
  }
});

router.get('/:id', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT v.*, c.name as category, b.name as branch 
       FROM vehicles v
       LEFT JOIN vehicle_categories c ON v.category_id = c.id
       LEFT JOIN branches b ON v.branch_id = b.id
       WHERE v.id = $1`, [id]
    );
    if (result.rows.length > 0) return res.json(result.rows[0]);
  } catch (error) {
    const v = MOCK_VEHICLES.find(item => item.id === id);
    if (v) return res.json(v);
  }
  return res.status(404).json({ message: 'Vehicle not found' });
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const newVehicle = {
    id: `v-${Date.now()}`,
    plateNumber: data.plateNumber,
    make: data.make,
    model: data.model,
    year: parseInt(data.year) || 2024,
    category: data.category || 'Service Vehicle',
    branch: data.branch || 'Delhi HQ',
    fuelType: data.fuelType || 'Diesel',
    fuelCapacity: parseFloat(data.fuelCapacity) || 40,
    odometer: parseInt(data.odometer) || 0,
    status: 'Active',
    healthScore: 100.0
  };
  MOCK_VEHICLES.push(newVehicle);
  return res.status(201).json(newVehicle);
});

router.put('/:id', authenticateJWT, authorizePermission('Update'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const index = MOCK_VEHICLES.findIndex(v => v.id === id);
  if (index !== -1) {
    MOCK_VEHICLES[index] = { ...MOCK_VEHICLES[index], ...data };
    return res.json(MOCK_VEHICLES[index]);
  }
  return res.status(404).json({ message: 'Vehicle not found' });
});

router.delete('/:id', authenticateJWT, authorizePermission('Delete'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  MOCK_VEHICLES = MOCK_VEHICLES.filter(v => v.id !== id);
  return res.json({ message: 'Vehicle deleted' });
});

export default router;
