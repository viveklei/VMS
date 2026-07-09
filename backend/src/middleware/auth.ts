import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
    branchId?: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_lei_fleetops_ai_2026') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token expired or blacklisted.' });
  }
};

export const authorizePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const hasAccess = req.user.permissions.includes(permission) || req.user.role === 'Super Admin';
    if (!hasAccess) {
      return res.status(403).json({ message: 'Insufficient privileges to perform this action.' });
    }

    next();
  };
};
