import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

// Mock data fallback
let MOCK_USERS = [
  { id: 'd3b07384-d113-49cd-a5d6-8c9012a64010', email: 'admin@fleetops.lei', firstName: 'Super', lastName: 'Admin', role: 'Super Admin', isActive: true, branch: 'Delhi HQ' },
  { id: 'u1111111-2222-3333-4444-555555555555', email: 'driver.amit@fleetops.lei', firstName: 'Amit', lastName: 'Kumar', role: 'Driver', isActive: true, branch: 'Delhi HQ' },
  { id: 'u2222222-3333-4444-5555-666666666666', email: 'manager.rajesh@fleetops.lei', firstName: 'Rajesh', lastName: 'Sharma', role: 'Fleet Manager', isActive: true, branch: 'Mumbai Branch' },
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.is_active, r.name as role, b.name as branch
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN branches b ON u.branch_id = b.id`
    );
    return res.json(result.rows);
  } catch (error) {
    // DB fallback
    return res.json(MOCK_USERS);
  }
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { email, firstName, lastName, role, branch } = req.body;
  const newUser = {
    id: `u-${Date.now()}`,
    email,
    firstName,
    lastName,
    role,
    isActive: true,
    branch: branch || 'Delhi HQ'
  };
  MOCK_USERS.push(newUser);
  return res.status(201).json(newUser);
});

router.put('/:id', authenticateJWT, authorizePermission('Update'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, isActive, role, branch } = req.body;
  const user = MOCK_USERS.find(u => u.id === id);
  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    if (isActive !== undefined) user.isActive = isActive;
    user.role = role || user.role;
    user.branch = branch || user.branch;
    return res.json(user);
  }
  return res.status(404).json({ message: 'User not found' });
});

router.delete('/:id', authenticateJWT, authorizePermission('Delete'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
  return res.json({ message: 'User deleted successfully' });
});

export default router;
