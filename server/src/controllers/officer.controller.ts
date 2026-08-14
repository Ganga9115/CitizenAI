import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ComplaintService, store } from '../services/complaint.service';

export class OfficerController {
  static async getQueue(req: AuthenticatedRequest, res: Response) {
    try {
      const complaints = await ComplaintService.getComplaints({});
      const myDeptId = req.user?.departmentId;

      const emergencyCount = complaints.filter(c => c.priority === 'Emergency').length;
      const highCount = complaints.filter(c => c.priority === 'High').length;
      const pendingCount = complaints.filter(c => c.status === 'Pending').length;
      const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

      return res.json({
        success: true,
        stats: {
          emergencyCount,
          highCount,
          pendingCount,
          resolvedCount,
          totalAssigned: complaints.length
        },
        complaints
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async assignComplaint(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { officerId, officerName } = req.body;

      const updated = await ComplaintService.updateStatus(
        id,
        'Assigned',
        officerId || req.user?.userId,
        officerName || req.user?.fullName
      );

      return res.json({
        success: true,
        message: 'Complaint assigned successfully',
        complaint: updated
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
