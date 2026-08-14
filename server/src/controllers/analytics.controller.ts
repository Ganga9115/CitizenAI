import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ComplaintService, store } from '../services/complaint.service';

export class AnalyticsController {
  static async getOverview(_req: AuthenticatedRequest, res: Response) {
    try {
      const data = await ComplaintService.getAnalytics();
      return res.json({ success: true, ...data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getScoreboard(_req: AuthenticatedRequest, res: Response) {
    try {
      const scoreboard = await ComplaintService.getScoreboard();
      return res.json({ success: true, scoreboard });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getMapMarkers(_req: AuthenticatedRequest, res: Response) {
    try {
      const markers = store.complaints.map(c => ({
        id: c.id,
        trackingNumber: c.tracking_number,
        category: c.category,
        priority: c.priority,
        status: c.status,
        summary: c.summary,
        location: c.location,
        lat: c.latitude,
        lng: c.longitude,
        affectedCount: c.affected_citizens_count,
        createdAt: c.created_at
      }));

      return res.json({ success: true, markers });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
