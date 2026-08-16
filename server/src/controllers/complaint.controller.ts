import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ComplaintService } from '../services/complaint.service';

export class ComplaintController {

  // =========================================================
  // CHECK SIMILAR COMPLAINT
  // =========================================================

  static async checkSimilar(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const {
        transcript,
        englishTranscript,
        category,
        location,
        latitude,
        longitude
      } = req.body;

      if (!transcript || !category) {
        return res.status(400).json({
          success: false,
          message:
            'Transcript and category are required'
        });
      }

      const matchResult =
        await ComplaintService.findSimilarComplaint(
          englishTranscript || transcript,
          category,
          location,
          latitude,
          longitude
        );

      return res.json({
        success: true,
        ...matchResult
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Similarity check error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message ||
          'Similarity check failed'
      });
    }
  }

  // =========================================================
  // I'M AFFECTED / ENDORSE
  // =========================================================

  static async endorseComplaint(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const { id } =
        req.params;

      const userId =
        req.user?.userId ||
        'usr-citizen-1';

      const userName =
        req.user?.fullName ||
        'Citizen User';

      const updated =
        await ComplaintService.endorseComplaint(
          id,
          userId,
          userName
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message:
            'Complaint not found'
        });
      }

      return res.json({
        success: true,
        message:
          'Community endorsement added ("I\'m Affected")',
        complaint: updated
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Endorse error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message
      });
    }
  }

  // =========================================================
  // FEEDBACK
  // =========================================================

  static async submitFeedback(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const { id } =
        req.params;

      const {
        rating,
        comment
      } = req.body;

      if (
        typeof rating !== 'number' ||
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Rating must be a number between 1 and 5'
        });
      }

      const updated =
        await ComplaintService.submitFeedback(
          id,
          rating,
          comment
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message:
            'Complaint not found'
        });
      }

      return res.json({
        success: true,
        message:
          'Feedback submitted successfully. Department score updated!',
        complaint: updated
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Feedback error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message
      });
    }
  }

  // =========================================================
  // CREATE COMPLAINT
  // =========================================================

  static async createComplaint(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const {
        transcript,
        analysis,
        audioUrl,
        audioDuration,
        customLocation,
        latitude,
        longitude
      } = req.body;

      if (!transcript || !analysis) {
        return res.status(400).json({
          success: false,
          message:
            'Transcript and analysis payload are required'
        });
      }

      // =====================================================
      // VALIDATE GPS
      // =====================================================

      let validLatitude:
        number | null = null;

      let validLongitude:
        number | null = null;

      if (
        latitude !== null &&
        latitude !== undefined &&
        latitude !== ''
      ) {
        const parsedLatitude =
          Number(latitude);

        if (
          Number.isFinite(
            parsedLatitude
          ) &&
          parsedLatitude >= -90 &&
          parsedLatitude <= 90
        ) {
          validLatitude =
            parsedLatitude;
        }
      }

      if (
        longitude !== null &&
        longitude !== undefined &&
        longitude !== ''
      ) {
        const parsedLongitude =
          Number(longitude);

        if (
          Number.isFinite(
            parsedLongitude
          ) &&
          parsedLongitude >= -180 &&
          parsedLongitude <= 180
        ) {
          validLongitude =
            parsedLongitude;
        }
      }

      console.log(
        '[ComplaintController] GPS received:',
        {
          latitude:
            validLatitude,
          longitude:
            validLongitude
        }
      );

      // =====================================================
      // CREATE
      // =====================================================

      const complaint =
        await ComplaintService.createComplaint({
          citizenId:
            req.user?.userId ||
            'usr-citizen-1',

          citizenName:
            req.user?.fullName ||
            'John Citizen',

          audioUrl:
            audioUrl ||
            '/uploads/sample.mp3',

          audioDuration:
            audioDuration || 30,

          transcript,

          analysis,

          customLocation,

          latitude:
            validLatitude,

          longitude:
            validLongitude
        });

      return res.status(201).json({
        success: true,
        message:
          'Complaint registered successfully',
        complaint
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Create complaint error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message ||
          'Failed to create complaint'
      });
    }
  }

  // =========================================================
  // GET COMPLAINTS
  // =========================================================

  static async getComplaints(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const {
        category,
        priority,
        department,
        status,
        search
      } = req.query;

      let citizenId:
        string | undefined;

      if (
        req.user?.role ===
        'CITIZEN'
      ) {
        citizenId =
          req.user.userId;
      }

      const complaints =
        await ComplaintService.getComplaints({
          category:
            category as string,
          priority:
            priority as string,
          department:
            department as string,
          status:
            status as string,
          search:
            search as string,
          citizenId
        });

      return res.json({
        success: true,
        count:
          complaints.length,
        complaints
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Get complaints error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message
      });
    }
  }

  // =========================================================
  // GET COMPLAINT BY ID
  // =========================================================

  static async getComplaintById(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const { id } =
        req.params;

      const complaint =
        await ComplaintService.getComplaintById(
          id
        );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message:
            'Complaint not found'
        });
      }

      return res.json({
        success: true,
        complaint
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Get complaint error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message
      });
    }
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  static async updateStatus(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            'Status is required'
        });
      }

      const updated =
        await ComplaintService.updateStatus(
          id,
          status,
          req.user?.userId,
          req.user?.fullName
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message:
            'Complaint not found'
        });
      }

      return res.json({
        success: true,
        message:
          `Complaint status updated to ${status}`,
        complaint:
          updated
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Update status error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message
      });
    }
  }

  // =========================================================
  // ADD NOTE
  // =========================================================

  static async addNote(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const { id } =
        req.params;

      const { note } =
        req.body;

      if (!note) {
        return res.status(400).json({
          success: false,
          message:
            'Note text is required'
        });
      }

      const newNote =
        await ComplaintService.addNote(
          id,
          req.user?.userId ||
            'usr-officer-1',
          req.user?.fullName ||
            'Officer',
          note
        );

      if (!newNote) {
        return res.status(404).json({
          success: false,
          message:
            'Complaint not found'
        });
      }

      return res.status(201).json({
        success: true,
        note:
          newNote
      });

    } catch (err: any) {

      console.error(
        '[ComplaintController] Add note error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message
      });
    }
  }
}