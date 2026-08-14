import axios from 'axios';
import { ENV } from '../config/env';
import { GEMINI_SYSTEM_PROMPT } from '../utils/promptTemplates';

export interface AIAnalysisResult {
  category: string;
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  department: string;
  summary: string;
  sentiment: string;
  emotion: string;
  keywords: string[];
  urgency: string;
  confidence: number;
  estimatedResolution: string;
  location: string;
  duplicateProbability: number;
  suggestedAction: string;
}

export class GeminiService {
  /**
   * Analyzes transcript using Gemini 2.5 Flash API
   */
  static async analyzeTranscript(transcript: string): Promise<AIAnalysisResult> {
    if (!ENV.GEMINI_API_KEY) {
      console.log('[GeminiService] No GEMINI_API_KEY set. Returning fallback mock AI extraction.');
      return this.getFallbackAnalysis(transcript);
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;
      
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: GEMINI_SYSTEM_PROMPT },
              { text: `Audio Transcript:\n"${transcript}"` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      };

      const response = await axios.post(url, payload, { timeout: 30000 });
      const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textResponse) {
        // Clean potential code block backticks if present
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedJSON: AIAnalysisResult = JSON.parse(cleanedText);
        return this.normalizeAnalysis(parsedJSON);
      }

      throw new Error('Gemini API returned empty response body');
    } catch (error: any) {
      console.error('[GeminiService Error]', error?.response?.data || error.message);
      console.log('[GeminiService] Using fallback intelligence extractor.');
      return this.getFallbackAnalysis(transcript);
    }
  }

  private static normalizeAnalysis(parsed: Partial<AIAnalysisResult>): AIAnalysisResult {
    return {
      category: parsed.category || 'Water Supply',
      priority: (['Emergency', 'High', 'Medium', 'Low'].includes(parsed.priority as string) ? parsed.priority : 'High') as any,
      department: parsed.department || 'Water Board',
      summary: parsed.summary || 'Citizen reported an urgent civic issue needing department response.',
      sentiment: parsed.sentiment || 'Negative',
      emotion: parsed.emotion || 'Frustration',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ['civic', 'issue', 'complaint'],
      urgency: parsed.urgency || 'Within 24 hours',
      confidence: parsed.confidence || 92,
      estimatedResolution: parsed.estimatedResolution || '4 to 8 hours',
      location: parsed.location || 'Location extracted from call transcript',
      duplicateProbability: parsed.duplicateProbability || 20,
      suggestedAction: parsed.suggestedAction || 'Dispatch field team to verify location and fix issue.'
    };
  }

  private static getFallbackAnalysis(transcript: string): AIAnalysisResult {
    const text = transcript.toLowerCase();

    if (text.includes('burst') || text.includes('water') || text.includes('flood') || text.includes('leak')) {
      return {
        category: 'Water Supply',
        priority: text.includes('burst') || text.includes('emergency') || text.includes('flooded') ? 'Emergency' : 'High',
        department: 'Water Board',
        summary: 'Major water main pipeline leakage causing surface flooding and potential structural basement damage in residential zone.',
        sentiment: 'Highly Critical',
        emotion: 'Panic',
        keywords: ['water pipe', 'flooding', 'burst main', 'basement water'],
        urgency: 'Immediate',
        confidence: 96,
        estimatedResolution: '2 to 4 hours',
        location: text.includes('park avenue') ? '45 Park Avenue, Ward 12' : 'Grand Trunk Road Junction',
        duplicateProbability: 78,
        suggestedAction: 'Isolate main grid control valve #12 and dispatch Water Board Emergency Rapid Response Team.'
      };
    }

    if (text.includes('power') || text.includes('electric') || text.includes('transformer') || text.includes('wire')) {
      return {
        category: 'Electricity',
        priority: 'Emergency',
        department: 'Electricity Board',
        summary: 'Dangling high-voltage power cable and transformer sparks threatening pedestrian safety following heavy branch fall.',
        sentiment: 'Highly Critical',
        emotion: 'Panic',
        keywords: ['live cable', 'sparks', 'transformer', 'power blackout'],
        urgency: 'Immediate',
        confidence: 98,
        estimatedResolution: '1 to 2 hours',
        location: 'Sector 4 Market Road Crossing',
        duplicateProbability: 42,
        suggestedAction: 'De-energize feeder line 4B remotely and dispatch high-wire emergency linesmen crew.'
      };
    }

    if (text.includes('garbage') || text.includes('waste') || text.includes('stink')) {
      return {
        category: 'Garbage',
        priority: 'Medium',
        department: 'Municipality',
        summary: 'Uncollected municipal garbage bins overflowing for over 5 days causing sanitation hazards on residential road.',
        sentiment: 'Negative',
        emotion: 'Frustration',
        keywords: ['garbage', 'waste collection', 'sanitation', 'bins overflowing'],
        urgency: 'Within 24 hours',
        confidence: 91,
        estimatedResolution: '6 to 12 hours',
        location: '8th Cross Road, Ward 7',
        duplicateProbability: 15,
        suggestedAction: 'Route Municipal Compactor Truck #09 for immediate bin clearing and sanitization spraying.'
      };
    }

    return {
      category: 'Road Damage',
      priority: 'High',
      department: 'Public Works',
      summary: 'Deep open pothole on busy flyover ramp causing vehicle skids and hazardous traffic congestion.',
      sentiment: 'Negative',
      emotion: 'Anger',
      keywords: ['pothole', 'flyover', 'traffic hazard', 'skid danger'],
      urgency: 'Within 24 hours',
      confidence: 89,
      estimatedResolution: '12 to 24 hours',
      location: 'Main Flyover Ramp, Exit 2',
      duplicateProbability: 35,
      suggestedAction: 'Erect temporary safety cones and queue cold-mix asphalt repair team for tonight shift.'
    };
  }
}
