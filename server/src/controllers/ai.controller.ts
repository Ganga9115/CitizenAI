import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  GroqService,
  TranscriptionResult
} from '../services/groq.service';
import { GroqAnalysisService } from '../services/groq-analysis.service';

export class AIController {

  /**
   * Process citizen audio:
   *
   * 1. Multilingual Whisper transcription
   * 2. English translation
   * 3. Complaint intelligence analysis
   * 4. Priority engine
   */

  static async processAudio(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      const filePath =
        req.file.path;

      console.log(
        `[AI Processing] Starting pipeline for ${req.file.originalname}`
      );

      // =====================================================
      // STEP 1 + 2:
      // ORIGINAL TRANSCRIPT + ENGLISH TRANSLATION
      // =====================================================

      const transcription:
        TranscriptionResult =
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
      // AI COMPLAINT ANALYSIS
      //
      // IMPORTANT:
      // Analyze the English meaning so classification and
      // priority are consistent across languages.
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

          // English interpretation
          englishTranscript:
            transcription.englishTranscript,

          analysis,

          audioUrl:
            `/uploads/${req.file.filename}`,

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