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

    const stats = fs.statSync(filePath);

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

    // Do NOT provide language.
    // Whisper automatically handles multilingual speech.

    transcriptionForm.append(
      'response_format',
      'json'
    );

    transcriptionForm.append(
      'temperature',
      '0'
    );

    transcriptionForm.append(
      'prompt',
      'Government citizen complaint call. Preserve the language spoken by the citizen and accurately transcribe names, locations, streets, departments and civic-service terms.'
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

      const originalTranscript =
        transcriptionResponse.data?.text?.trim();

      if (!originalTranscript) {
        throw new Error(
          'Groq returned an empty original transcript.'
        );
      }

      console.log(
        '[GroqService] Original transcript:',
        originalTranscript
      );

      // =====================================================
      // 2. ENGLISH TRANSLATION
      // =====================================================

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

      translationForm.append(
        'prompt',
        'Translate this citizen complaint accurately into English. Preserve the meaning of locations, civic problems, departments, quantities, durations, safety conditions and urgency. Do not add or remove facts.'
      );

      console.log(
        '[GroqService] Requesting English translation...'
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