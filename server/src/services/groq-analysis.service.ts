import axios from 'axios';
import { ENV } from '../config/env';
import { PriorityService } from './priority.service';

export interface AIAnalysisResult {
  category: string;
  department: string;
  summary: string;

  // AI-extracted situation signals
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  emergency: boolean;
  urgency: string;
  timeSensitivity: 'Immediate' | 'High' | 'Medium' | 'Low';

  // Sentiment / emotion
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Highly Negative';
  emotion: string;
  emotionIntensity: number;

  // Complaint information
  keywords: string[];
  location: string;
  peopleAffected: number | null;

  // AI confidence
  confidence: number;

  // Other intelligence
  estimatedResolution: string;
  duplicateProbability: number;
  suggestedAction: string;

  // Final priority calculated by our backend
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  priorityScore: number;
  priorityReasons: string[];
}

export class GroqAnalysisService {
  static async analyzeTranscript(
    transcript: string
  ): Promise<AIAnalysisResult> {
    // ========================================================
    // VALIDATION
    // ========================================================

    if (!ENV.GROQ_API_KEY) {
      throw new Error(
        'GROQ_API_KEY is not configured in the backend .env file.'
      );
    }

    if (!transcript || !transcript.trim()) {
      throw new Error('Cannot analyze an empty transcript.');
    }

    console.log(
      '[GroqAnalysis] Starting complaint analysis...'
    );

    // ========================================================
    // AI PROMPT
    // ========================================================

    const prompt = `
You are an AI Citizen Complaint Intelligence system used by a government organization.

Analyze the citizen complaint transcript below and extract ONLY information
that is actually supported by the transcript.

Your job is to understand the situation, classify the complaint, identify the
responsible department, analyze sentiment/emotion, identify severity and
time sensitivity, and extract useful information for a government officer.

CRITICAL RULE:

Do NOT invent facts.

Do NOT create a complaint that was not mentioned.

Do NOT invent:
- locations
- number of citizens
- emergencies
- injuries
- property damage
- causes
- department actions
- events

If information is not present, use "Not specified" or null.

========================================================
COMPLAINT CLASSIFICATION
========================================================

Choose the most appropriate category.

Examples:

Water Supply
Electricity
Road Damage
Garbage
Drainage
Sewage
Streetlight
Public Transport
Traffic
Healthcare
Public Safety
Fire Emergency
Flooding
Sanitation
Other Civic Issue

========================================================
DEPARTMENT
========================================================

Choose the responsible department.

Examples:

Water Board
Electricity Board
Municipality
Public Works Department
Transport Department
Health Department
Police
Fire and Rescue
Sanitation Department
Drainage Department

========================================================
SEVERITY
========================================================

Choose exactly one:

Critical
High
Medium
Low

Critical:
Immediate or serious threat to life, safety, or major public infrastructure.

High:
Serious civic problem requiring rapid attention.

Medium:
Important civic problem but without immediate danger.

Low:
Minor or routine civic issue.

========================================================
EMERGENCY
========================================================

Set emergency=true ONLY when there is an actual immediate danger such as:

- threat to human life
- immediate physical safety risk
- exposed live electrical infrastructure
- fire
- major flood
- gas leak
- dangerous structural failure
- major public safety hazard

A citizen being angry does NOT make a complaint an emergency.

========================================================
TIME SENSITIVITY
========================================================

Choose exactly one:

Immediate
High
Medium
Low

Use Immediate only when delay can create serious harm.

========================================================
SENTIMENT
========================================================

Choose exactly one:

Positive
Neutral
Negative
Highly Negative

========================================================
EMOTION
========================================================

Identify the dominant emotion.

Examples:

Frustration
Anger
Fear
Panic
Anxiety
Sadness
Concern
Distress
Neutral

========================================================
EMOTION INTENSITY
========================================================

Return a number from 0 to 1.

0.0 = no emotional intensity
0.5 = moderate
1.0 = extreme

IMPORTANT:

Emotion is only a supporting signal.

Do NOT classify a complaint as Emergency simply because
emotion intensity is high.

========================================================
LOCATION
========================================================

Extract the location only if it appears in the transcript.

Otherwise return:

"Not specified"

========================================================
PEOPLE AFFECTED
========================================================

Only return a number if the transcript explicitly mentions
how many people/families/residents are affected.

Otherwise:

null

Do NOT estimate.

========================================================
CONFIDENCE
========================================================

Return a number between 0 and 100 representing confidence
in your extracted information.

========================================================
DUPLICATE PROBABILITY
========================================================

Estimate only from the transcript itself.

Return a number from 0 to 100.

This is NOT actual duplicate detection.

Actual duplicate detection will happen later by comparing
this complaint with existing complaints.

========================================================
SUGGESTED ACTION
========================================================

Give a practical action for the responsible department.

Do not invent internal employee names, vehicle numbers,
equipment IDs, valve numbers or other fictional resources.

========================================================
IMPORTANT
========================================================

Do NOT return the final priority.

The backend PriorityService will calculate the final priority
using severity, emergency, time sensitivity, essential service,
number of affected people and emotion.

Return ONLY valid JSON.

========================================================
JSON FORMAT
========================================================

{
  "category": "string",
  "department": "string",
  "summary": "string",

  "severity": "Critical | High | Medium | Low",
  "emergency": false,

  "urgency": "string",
  "timeSensitivity": "Immediate | High | Medium | Low",

  "sentiment": "Positive | Neutral | Negative | Highly Negative",
  "emotion": "string",
  "emotionIntensity": 0.0,

  "keywords": ["string"],

  "location": "string",
  "peopleAffected": null,

  "confidence": 0.0,

  "estimatedResolution": "string",
  "duplicateProbability": 0.0,

  "suggestedAction": "string"
}

========================================================
CITIZEN TRANSCRIPT
========================================================

${transcript}
`;

    try {
      // ======================================================
      // GROQ LLM REQUEST
      // ======================================================

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',

          messages: [
            {
              role: 'system',
              content:
                'You are a government citizen complaint intelligence AI. Return valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],

          temperature: 0.1,

          response_format: {
            type: 'json_object'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },

          timeout: 30000
        }
      );

      // ======================================================
      // EXTRACT RESPONSE
      // ======================================================

      const textResponse =
        response.data?.choices?.[0]?.message?.content;

      if (!textResponse) {
        throw new Error(
          'Groq returned an empty analysis response.'
        );
      }

      console.log(
        '[GroqAnalysis] Raw response:',
        textResponse
      );

      // ======================================================
      // PARSE JSON
      // ======================================================

      let parsed: Partial<AIAnalysisResult>;

      try {
        parsed = JSON.parse(textResponse);
      } catch (error) {
        console.error(
          '[GroqAnalysis] Invalid JSON returned by Groq:',
          textResponse
        );

        throw new Error(
          'Groq returned invalid JSON.'
        );
      }

      // ======================================================
      // NORMALIZE AI SIGNALS
      // ======================================================

      const analysis =
        this.normalizeAnalysis(parsed);

      // ======================================================
      // CALCULATE FINAL PRIORITY
      // ======================================================

      const priorityResult =
        PriorityService.calculatePriority({
          severity: analysis.severity,
          emergency: analysis.emergency,
          timeSensitivity: analysis.timeSensitivity,
          sentiment: analysis.sentiment,
          emotionIntensity: analysis.emotionIntensity,
          peopleAffected: analysis.peopleAffected,
          category: analysis.category,
          summary: analysis.summary
        });

      analysis.priority =
        priorityResult.priority;

      analysis.priorityScore =
        priorityResult.score;

      analysis.priorityReasons =
        priorityResult.reasons;

      // ======================================================
      // LOG FINAL RESULT
      // ======================================================

      console.log(
        '===================================================='
      );

      console.log(
        '[GroqAnalysis] Analysis completed.'
      );

      console.log(
        '[GroqAnalysis] Category:',
        analysis.category
      );

      console.log(
        '[GroqAnalysis] Department:',
        analysis.department
      );

      console.log(
        '[GroqAnalysis] Severity:',
        analysis.severity
      );

      console.log(
        '[GroqAnalysis] Emergency:',
        analysis.emergency
      );

      console.log(
        '[GroqAnalysis] Sentiment:',
        analysis.sentiment
      );

      console.log(
        '[GroqAnalysis] Emotion:',
        analysis.emotion
      );

      console.log(
        '[GroqAnalysis] Emotion intensity:',
        analysis.emotionIntensity
      );

      console.log(
        '[PriorityEngine] Score:',
        analysis.priorityScore
      );

      console.log(
        '[PriorityEngine] Final Priority:',
        analysis.priority
      );

      console.log(
        '[PriorityEngine] Reasons:',
        analysis.priorityReasons
      );

      console.log(
        '===================================================='
      );

      return analysis;

    } catch (error: any) {
      console.error(
        '[GroqAnalysis] Analysis failed.'
      );

      if (error.response) {
        console.error(
          '[GroqAnalysis] HTTP Status:',
          error.response.status
        );

        console.error(
          '[GroqAnalysis] API Response:',
          error.response.data
        );
      } else {
        console.error(
          '[GroqAnalysis] Error:',
          error.message
        );
      }

      throw new Error(
        'Groq complaint analysis failed. Please check the Groq API configuration.'
      );
    }
  }

  // =========================================================
  // NORMALIZE AI RESPONSE
  // =========================================================

  private static normalizeAnalysis(
    parsed: Partial<AIAnalysisResult>
  ): AIAnalysisResult {
    const validSeverities = [
      'Critical',
      'High',
      'Medium',
      'Low'
    ];

    const validSentiments = [
      'Positive',
      'Neutral',
      'Negative',
      'Highly Negative'
    ];

    const validTimeSensitivity = [
      'Immediate',
      'High',
      'Medium',
      'Low'
    ];

    const severity =
      validSeverities.includes(
        parsed.severity as string
      )
        ? parsed.severity!
        : 'Medium';

    const sentiment =
      validSentiments.includes(
        parsed.sentiment as string
      )
        ? parsed.sentiment!
        : 'Neutral';

    const timeSensitivity =
      validTimeSensitivity.includes(
        parsed.timeSensitivity as string
      )
        ? parsed.timeSensitivity!
        : 'Medium';

    // ---------------------------------------------------------
    // Emotion intensity
    // ---------------------------------------------------------

    let emotionIntensity =
      typeof parsed.emotionIntensity === 'number'
        ? parsed.emotionIntensity
        : 0.5;

    emotionIntensity =
      Math.max(
        0,
        Math.min(
          1,
          emotionIntensity
        )
      );

    // ---------------------------------------------------------
    // Confidence
    // ---------------------------------------------------------

    let confidence =
      typeof parsed.confidence === 'number'
        ? parsed.confidence
        : 80;

    confidence =
      Math.max(
        0,
        Math.min(
          100,
          confidence
        )
      );

    // ---------------------------------------------------------
    // Duplicate probability
    // ---------------------------------------------------------

    let duplicateProbability =
      typeof parsed.duplicateProbability === 'number'
        ? parsed.duplicateProbability
        : 0;

    duplicateProbability =
      Math.max(
        0,
        Math.min(
          100,
          duplicateProbability
        )
      );

    // ---------------------------------------------------------
    // People affected
    // ---------------------------------------------------------

    const peopleAffected =
      typeof parsed.peopleAffected === 'number' &&
      parsed.peopleAffected >= 0
        ? Math.floor(parsed.peopleAffected)
        : null;

    // ---------------------------------------------------------
    // Keywords
    // ---------------------------------------------------------

    const keywords =
      Array.isArray(parsed.keywords)
        ? parsed.keywords.filter(
            (keyword): keyword is string =>
              typeof keyword === 'string'
          )
        : [];

    // ---------------------------------------------------------
    // Return normalized analysis
    // ---------------------------------------------------------

    return {
      category:
        parsed.category ||
        'General Civic Issue',

      department:
        parsed.department ||
        'Municipality',

      summary:
        parsed.summary ||
        'Citizen reported a civic issue requiring review.',

      severity,

      emergency:
        parsed.emergency === true,

      urgency:
        parsed.urgency ||
        'Within 24 hours',

      timeSensitivity,

      sentiment,

      emotion:
        parsed.emotion ||
        'Concern',

      emotionIntensity,

      keywords,

      location:
        parsed.location ||
        'Not specified',

      peopleAffected,

      confidence,

      estimatedResolution:
        parsed.estimatedResolution ||
        'To be determined',

      duplicateProbability,

      suggestedAction:
        parsed.suggestedAction ||
        'Forward complaint to the appropriate department for review.',

      // The final value will be calculated by PriorityService
      priority: 'Low',

      // Initial values, overwritten immediately after
      // PriorityService calculation
      priorityScore: 0,

      priorityReasons: []
    };
  }
}