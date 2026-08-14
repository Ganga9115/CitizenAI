import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { store } from '../services/complaint.service';

export class AdminController {
  static async getUsers(_req: AuthenticatedRequest, res: Response) {
    try {
      const users = store.users.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        phone: u.phone,
        role: u.role,
        departmentId: u.department_id,
        createdAt: u.created_at
      }));

      return res.json({ success: true, users });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getDepartments(_req: AuthenticatedRequest, res: Response) {
    try {
      return res.json({ success: true, departments: store.departments });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAuditLogs(_req: AuthenticatedRequest, res: Response) {
    try {
      return res.json({ success: true, logs: store.logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateUserRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { role, departmentId } = req.body;

      const user = store.users.find(u => u.id === userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (role) user.role = role;
      if (departmentId !== undefined) user.department_id = departmentId;

      store.logs.unshift({
        id: `log-${Date.now()}`,
        user_name: req.user?.fullName || 'Admin',
        action: 'USER_ROLE_UPDATED',
        details: { targetUserId: userId, newRole: role },
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      });

      return res.json({ success: true, message: 'User updated successfully', user });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
