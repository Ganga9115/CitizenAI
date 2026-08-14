import { Request, Response } from 'express';
import { store } from '../services/complaint.service';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, phone, role, departmentId } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ success: false, message: 'Email, password, and full name are required' });
      }

      // Check existing
      const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const passwordHash = await hashPassword(password);
      const userRole = role || 'CITIZEN';

      const newUser = {
        id: `usr-${Date.now()}`,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        phone: phone || '',
        role: userRole,
        department_id: departmentId || null,
        created_at: new Date().toISOString()
      };

      store.users.push(newUser);

      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.full_name,
        departmentId: newUser.department_id
      });

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          departmentId: newUser.department_id
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        departmentId: user.department_id
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          departmentId: user.department_id
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    
    const user = store.users.find(u => u.id === req.user?.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        departmentId: user.department_id
      }
    });
  }
}
