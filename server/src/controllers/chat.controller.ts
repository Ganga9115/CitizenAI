import { Request, Response } from 'express';

import {
  ChatService,
  ChatMessage,
  ChatUser
} from '../services/chat.service';

import {
  ComplaintService
} from '../services/complaint.service';

export const chatController = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const {
      message,
      history = []
    } = req.body;

    // =========================================================
    // VALIDATION
    // =========================================================

    if (
      !message ||
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.'
      });
    }

    // =========================================================
    // AUTHENTICATED USER
    // =========================================================

    const user =
      (req as any).user || null;

    // =========================================================
    // CITIZEN ONLY
    // =========================================================

    if (
      user &&
      user.role &&
      user.role.toUpperCase() !== 'CITIZEN'
    ) {
      return res.status(403).json({
        success: false,
        message:
          'CitizenAssist is available only for citizen accounts.'
      });
    }

    // =========================================================
    // HISTORY
    // =========================================================

    const chatHistory: ChatMessage[] =
      Array.isArray(history)
        ? history
            .filter(
              (item: any) =>
                item &&
                (
                  item.role === 'user' ||
                  item.role === 'assistant'
                ) &&
                typeof item.content === 'string'
            )
            .slice(-10)
        : [];

    // =========================================================
    // CHAT USER
    // =========================================================

    const chatUser: ChatUser | null =
      user
        ? {
            id: user.id,
            userId: user.userId,
            role: user.role,
            fullName: user.fullName,
            name: user.name
          }
        : null;

    // =========================================================
    // CITIZEN COMPLAINT CONTEXT
    // =========================================================

    let complaintContext: any[] | null = null;

    if (
      user &&
      user.role?.toUpperCase() === 'CITIZEN'
    ) {

      const citizenId =
        user.userId ||
        user.id;

      if (citizenId) {

        console.log(
          '[CitizenAssist] Loading complaints for citizen:',
          citizenId
        );

        const complaints =
          await ComplaintService.getComplaints({
            citizenId
          });

        console.log(
          '[CitizenAssist] Citizen complaints found:',
          complaints.length
        );

        // -----------------------------------------------------
        // Only expose fields that CitizenAssist actually needs.
        // Do NOT send unnecessary/internal data to the AI.
        // -----------------------------------------------------

        complaintContext =
          complaints.map((complaint) => ({
            id: complaint.id,
            tracking_number:
              complaint.tracking_number,

            category:
              complaint.category,

            summary:
              complaint.summary,

            priority:
              complaint.priority,

            department:
              complaint.department_name,

            status:
              complaint.status,

            location:
              complaint.location,

            created_at:
              complaint.created_at,

            updated_at:
              complaint.updated_at,

            urgency:
              complaint.urgency,

            estimated_resolution:
              complaint.estimated_resolution,

            is_escalated:
              complaint.is_escalated
          }));

      } else {

        console.warn(
          '[CitizenAssist] Authenticated citizen has no user ID.'
        );

        complaintContext = [];
      }
    }

    // =========================================================
    // SEND TO AI
    // =========================================================

    const reply =
      await ChatService.sendMessage(
        message,
        chatHistory,
        chatUser,
        complaintContext
      );

    // =========================================================
    // RESPONSE
    // =========================================================

    return res.status(200).json({
      success: true,
      reply,
      authenticated: Boolean(user),
      role:
        user?.role ||
        'GUEST',
      complaintCount:
        complaintContext?.length || 0
    });

  } catch (error: any) {

    console.error(
      '[CitizenAssist] Chat controller error:',
      error?.message || error
    );

    console.error(
      error?.stack || ''
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        'The AI assistant is temporarily unavailable. Please try again.'
    });
  }
};