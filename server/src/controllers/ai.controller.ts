import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { GroqService } from '../services/groq.service';
import { GroqAnalysisService } from '../services/groq-analysis.service';

export class AIController {
  /**
   * Process uploaded citizen audio:
   *
   * 1. Groq Whisper -> original-language transcript
   * 2. Groq Whisper translation -> English transcript
   * 3. Groq LLM -> complaint analysis + sentiment + priority
   */
  static async processAudio(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      // =====================================================
      // CHECK AUDIO FILE
      // =====================================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      const filePath = req.file.path;

      console.log(
        `[AI Processing] Starting pipeline for ${req.file.originalname}`
      );

      // =====================================================
      // STEP 1 + 2:
      // MULTILINGUAL TRANSCRIPTION + ENGLISH TRANSLATION
      // =====================================================

      const transcription =
        await GroqService.transcribeAudio(
          filePath
        );

      console.log(
        '[AI Processing] Original transcript:',
        transcription.originalTranscript
      );

      console.log(
        '[AI Processing] English translation:',
        transcription.englishTranscript
      );

      // =====================================================
      // STEP 3:
      // COMPLAINT ANALYSIS
      // =====================================================

      const analysis =
        await GroqAnalysisService.analyzeTranscript(
          transcription.englishTranscript
        );

      console.log(
        '[AI Processing] Complaint analysis completed successfully.'
      );

      // =====================================================
      // RESPONSE
      // =====================================================

      return res.json({
        success: true,

        data: {
          // Original language transcript
          transcript:
            transcription.originalTranscript,

          // English meaning
          englishTranscript:
            transcription.englishTranscript,

          // AI analysis
          analysis,

          // Uploaded audio
          audioUrl:
            `/uploads/${req.file.filename}`,

          // Temporary until actual duration calculation
          audioDuration: 0
        }
      });

    } catch (err: any) {

      console.error(
        '[AI Processing Controller Error]',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message ||
          'AI Audio processing failed'
      });
    }
  }
}