import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { ENV } from '../config/env';

export interface TranscriptionResult {
  originalTranscript: string;
  englishTranscript: string;
}

export class GroqService {

  static async transcribeAudio(
    filePath: string
  ): Promise<TranscriptionResult> {

    console.log(
      '[GroqService] Starting multilingual speech processing...'
    );

    if (!ENV.GROQ_API_KEY) {
      throw new Error(
        'GROQ_API_KEY is not configured in the backend .env file.'
      );
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Audio file not found: ${filePath}`
      );
    }

    const stats =
      fs.statSync(filePath);

    console.log(
      '[GroqService] File size:',
      stats.size,
      'bytes'
    );

    if (stats.size === 0) {
      throw new Error(
        'Uploaded audio file is empty.'
      );
    }

    // =======================================================
    // 1. ORIGINAL-LANGUAGE TRANSCRIPTION
    // =======================================================

    const transcriptionForm =
      new FormData();

    transcriptionForm.append(
      'file',
      fs.createReadStream(filePath)
    );

    transcriptionForm.append(
      'model',
      'whisper-large-v3'
    );

    /*
     * Do NOT force a language here.
     *
     * Whisper will automatically detect the spoken language.
     * We request verbose_json so that we can inspect the
     * detected language.
     */

    transcriptionForm.append(
      'response_format',
      'verbose_json'
    );

    /*
     * Important:
     *
     * temperature=0 gives the most deterministic behavior
     * supported by the API.
     */
    transcriptionForm.append(
      'temperature',
      '0'
    );

    /*
     * Keep the prompt short and relevant.
     *
     * Groq documents prompts as optional guidance for style
     * and terminology.
     */
    transcriptionForm.append(
      'prompt',
      'Citizen complaint call. Accurately transcribe the spoken words. Preserve names, locations, streets, departments, quantities and civic-service terminology. Do not invent words or facts.'
    );

    try {

      console.log(
        '[GroqService] Requesting original-language transcript...'
      );

      const transcriptionResponse =
        await axios.post(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          transcriptionForm,
          {
            headers: {
              Authorization:
                `Bearer ${ENV.GROQ_API_KEY}`,

              ...transcriptionForm.getHeaders()
            },

            timeout: 60000,

            maxContentLength:
              Infinity,

            maxBodyLength:
              Infinity
          }
        );

      const transcriptionData =
        transcriptionResponse.data;

      const originalTranscript =
        transcriptionData?.text?.trim();

      if (!originalTranscript) {

        throw new Error(
          'Groq returned an empty original transcript.'
        );
      }

      /*
       * verbose_json normally provides the detected language.
       *
       * Example:
       * language = "en"
       * language = "ta"
       * language = "hi"
       */

      const detectedLanguage =
        typeof transcriptionData?.language === 'string'
          ? transcriptionData.language
              .trim()
              .toLowerCase()
          : '';

      console.log(
        '[GroqService] Detected language:',
        detectedLanguage || 'unknown'
      );

      console.log(
        '[GroqService] Original transcript:',
        originalTranscript
      );

      // =====================================================
      // 2. ENGLISH AUDIO
      // =====================================================

      /*
       * IMPORTANT:
       *
       * If the audio is already English, do NOT send it
       * through the translation endpoint.
       *
       * The original transcript is already the English
       * transcript we need for analysis.
       *
       * This prevents unnecessary translation requests and
       * avoids fabricated/repeated text for English audio.
       */

      if (
        detectedLanguage === 'en'
      ) {

        console.log(
          '[GroqService] Audio already detected as English.'
        );

        console.log(
          '[GroqService] Skipping English translation endpoint.'
        );

        console.log(
          '[GroqService] English transcript:',
          originalTranscript
        );

        return {
          originalTranscript,
          englishTranscript:
            originalTranscript
        };
      }

      // =====================================================
      // 3. NON-ENGLISH AUDIO → ENGLISH TRANSLATION
      // =====================================================

      console.log(
        '[GroqService] Non-English audio detected.'
      );

      console.log(
        '[GroqService] Requesting English translation...'
      );

      const translationForm =
        new FormData();

      translationForm.append(
        'file',
        fs.createReadStream(filePath)
      );

      translationForm.append(
        'model',
        'whisper-large-v3'
      );

      translationForm.append(
        'response_format',
        'json'
      );

      translationForm.append(
        'temperature',
        '0'
      );

      /*
       * Groq's translation endpoint translates the speech
       * directly into English.
       *
       * The prompt is intentionally focused on fidelity and
       * does not ask the model to invent or summarize anything.
       */
      translationForm.append(
        'prompt',
        'Translate the spoken citizen complaint into English faithfully. Preserve the exact meaning of locations, civic problems, departments, quantities, durations, safety conditions and urgency. Do not add, remove, summarize or invent facts.'
      );

      const translationResponse =
        await axios.post(
          'https://api.groq.com/openai/v1/audio/translations',
          translationForm,
          {
            headers: {
              Authorization:
                `Bearer ${ENV.GROQ_API_KEY}`,

              ...translationForm.getHeaders()
            },

            timeout: 60000,

            maxContentLength:
              Infinity,

            maxBodyLength:
              Infinity
          }
        );

      const englishTranscript =
        translationResponse.data?.text?.trim();

      if (!englishTranscript) {

        throw new Error(
          'Groq returned an empty English translation.'
        );
      }

      console.log(
        '[GroqService] English translation:',
        englishTranscript
      );

      // =====================================================
      // RETURN BOTH
      // =====================================================

      return {
        originalTranscript,
        englishTranscript
      };

    } catch (error: any) {

      console.error(
        '[GroqService] Multilingual processing failed.'
      );

      if (error.response) {

        console.error(
          '[GroqService] HTTP Status:',
          error.response.status
        );

        console.error(
          '[GroqService] API Response:',
          error.response.data
        );

      } else {

        console.error(
          '[GroqService] Error:',
          error.message
        );
      }

      throw new Error(
        'Speech-to-text/translation failed. Please check the Groq API and audio file.'
      );
    }
  }
}