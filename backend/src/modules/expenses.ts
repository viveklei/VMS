import { Router, Response } from 'express';
import { authenticateJWT, authorizePermission, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/db';

const router = Router();

let MOCK_EXPENSES = [
  { id: 'e1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', category: 'Toll Tax', amount: 350.00, date: '2026-06-16', description: 'Yamuna Expressway Toll Ticket', status: 'Approved' },
  { id: 'e2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', category: 'Driver Allowance', amount: 1200.00, date: '2026-06-17', description: 'Overnight journey food & accommodation allowance', status: 'Pending' }
];

router.get('/', authenticateJWT, authorizePermission('Read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT e.*, v.plate_number, ec.name as category 
       FROM expenses e
       LEFT JOIN vehicles v ON e.vehicle_id = v.id
       LEFT JOIN expense_categories ec ON e.category_id = ec.id`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.json(MOCK_EXPENSES);
  }
});

router.post('/', authenticateJWT, authorizePermission('Create'), async (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, category, amount, date, description } = req.body;
  const newExpense = {
    id: `e-${Date.now()}`,
    vehicleId,
    plateNumber: 'DL-3C-AS-1294',
    category: category || 'Miscellaneous',
    amount: parseFloat(amount) || 0,
    date: date || new Date().toISOString().split('T')[0],
    description: description || '',
    status: 'Pending'
  };
  MOCK_EXPENSES.push(newExpense);
  return res.status(201).json(newExpense);
});

router.put('/:id/approve', authenticateJWT, authorizePermission('Approve'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const expense = MOCK_EXPENSES.find(e => e.id === id);
  if (expense) {
    expense.status = 'Approved';
    return res.json(expense);
  }
  return res.status(404).json({ message: 'Expense entry not found' });
});

export default router;
