import axios from 'axios';
import { ENV } from '../config/env';
import { PriorityService } from './priority.service';

export interface AIAnalysisResult {
  category: string;
  department: string;
  summary: string;

  severity:
    | 'Critical'
    | 'High'
    | 'Medium'
    | 'Low';

  emergency: boolean;

  urgency: string;

  timeSensitivity:
    | 'Immediate'
    | 'High'
    | 'Medium'
    | 'Low';

  sentiment:
    | 'Positive'
    | 'Neutral'
    | 'Negative'
    | 'Highly Negative';

  emotion: string;

  emotionIntensity: number;

  keywords: string[];

  location: string;

  peopleAffected: number | null;

  confidence: number;

  estimatedResolution: string;

  duplicateProbability: number;

  suggestedAction: string;

  priority:
    | 'Emergency'
    | 'High'
    | 'Medium'
    | 'Low';

  priorityScore: number;

  priorityReasons: string[];
}

export class GroqAnalysisService {

  // =========================================================
  // ANALYZE TRANSCRIPT
  // =========================================================

  static async analyzeTranscript(
    transcript: string
  ): Promise<AIAnalysisResult> {

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!ENV.GROQ_API_KEY) {

      throw new Error(
        'GROQ_API_KEY is not configured in the backend .env file.'
      );
    }

    if (
      !transcript ||
      !transcript.trim()
    ) {

      throw new Error(
        'Cannot analyze an empty transcript.'
      );
    }

    const cleanedTranscript =
      transcript.trim();

    console.log(
      '[GroqAnalysis] Starting complaint analysis...'
    );

    console.log(
      '[GroqAnalysis] Transcript received:',
      cleanedTranscript
    );

    // =======================================================
    // AI PROMPT
    // =======================================================

    const prompt = `
You are the complaint-classification engine for CivicAI,
a government citizen complaint intelligence platform.

Analyze ONLY the citizen transcript provided below.

The transcript is the citizen's actual speech.

DO NOT invent information.

DO NOT assume facts that were not spoken.

DO NOT turn a normal civic complaint into an emergency.

=========================================================
ABSOLUTE GROUNDING RULE
=========================================================

Use ONLY evidence present in the transcript.

Never invent:

- locations
- streets
- ward numbers
- people counts
- injuries
- deaths
- fires
- floods
- electrical hazards
- property damage
- causes
- events
- department actions

If something is not explicitly stated:

location = "Not specified"

peopleAffected = null

=========================================================
CATEGORY
=========================================================

Choose exactly the most appropriate civic category.

Allowed categories:

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

Important examples:

"water scarcity"
"water shortage"
"no drinking water"
"no water"
"water supply problem"
"water is not coming"

=> Water Supply

"power cut"
"electricity problem"
"no current"
"power outage"
"transformer"
"live electrical wire"

=> Electricity

"garbage"
"waste"
"trash"
"overflowing garbage"

=> Garbage

"pothole"
"damaged road"
"broken road"

=> Road Damage

=========================================================
DEPARTMENT
=========================================================

Choose exactly one responsible department.

Allowed departments:

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

Examples:

Water Supply -> Water Board
Electricity -> Electricity Board
Road Damage -> Public Works Department
Garbage -> Municipality
Drainage -> Drainage Department
Sewage -> Drainage Department
Streetlight -> Municipality
Public Transport -> Transport Department
Traffic -> Police
Healthcare -> Health Department
Fire Emergency -> Fire and Rescue
Public Safety -> Police

=========================================================
EMERGENCY
=========================================================

Emergency is NOT the same as important.

Set emergency=true ONLY when the transcript contains
actual immediate danger.

Examples:

- active fire
- gas leak
- live exposed electrical wires
- electrical sparks creating immediate danger
- structural collapse
- immediate threat to human life
- major flooding creating immediate danger
- serious public safety hazard

IMPORTANT:

These are NOT automatically emergencies:

- water scarcity
- water shortage
- electricity outage
- garbage collection delay
- road repair
- streetlight failure
- citizen anger
- citizen frustration

A complaint being serious or urgent does not automatically
make it an emergency.

=========================================================
SEVERITY
=========================================================

Critical:

Only when there is immediate serious danger or major
public infrastructure danger.

High:

Serious civic problem requiring rapid attention but
without an immediate life-threatening emergency.

Medium:

Important civic problem without immediate danger.

Low:

Minor or routine civic issue.

Examples:

"no drinking water for several days"
=> Medium or High

"severe water scarcity affecting residents"
=> High

"live electrical wire sparking on road"
=> Critical

"garbage not collected for two days"
=> Medium

=========================================================
TIME SENSITIVITY
=========================================================

Immediate:

Actual emergency where delay can cause serious harm.

High:

Serious essential-service problem requiring quick action.

Medium:

Important but not immediately dangerous.

Low:

Routine issue.

=========================================================
SENTIMENT
=========================================================

Choose:

Positive
Neutral
Negative
Highly Negative

=========================================================
EMOTION
=========================================================

Choose the dominant emotion.

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

Emotion must come from the language actually used.

=========================================================
EMOTION INTENSITY
=========================================================

Number from 0 to 1.

0.0 = no emotional intensity
0.5 = moderate
1.0 = extreme

Emotion must NEVER create an emergency by itself.

=========================================================
LOCATION
=========================================================

Extract ONLY a location explicitly spoken.

If no location is mentioned:

"Not specified"

Do not infer location from GPS.

GPS is handled separately by the backend.

=========================================================
PEOPLE AFFECTED
=========================================================

Only provide a number when the citizen explicitly
mentions a number of affected people, families,
households or residents.

Otherwise:

null

Never estimate.

=========================================================
CONFIDENCE
=========================================================

Number between 0 and 100.

=========================================================
DUPLICATE PROBABILITY
=========================================================

Estimate only from this transcript.

This is NOT actual duplicate detection.

Actual duplicate detection occurs separately.

Return number from 0 to 100.

=========================================================
ESTIMATED RESOLUTION
=========================================================

Give a reasonable general estimate based on the issue.

Do not invent internal resources or personnel.

=========================================================
SUGGESTED ACTION
=========================================================

Give a practical department-level action.

Do not invent employee names, vehicle numbers,
equipment IDs, valve numbers or fictional resources.

=========================================================
FINAL PRIORITY
=========================================================

DO NOT calculate final priority.

The backend PriorityService will calculate it.

=========================================================
CITIZEN TRANSCRIPT
=========================================================

${cleanedTranscript}
`;

    try {

      // =====================================================
      // GROQ STRUCTURED OUTPUT
      // =====================================================

      const model =
        'openai/gpt-oss-120b';

      console.log(
        '[GroqAnalysis] Using Groq model:',
        model
      );

      const response =
        await axios.post(

          'https://api.groq.com/openai/v1/chat/completions',

          {
            model,

            messages: [
              {
                role: 'system',
                content:
                  'You are CivicAI government complaint classification AI. Analyze only the supplied citizen transcript. Never invent facts. Return only the required JSON structure.'
              },

              {
                role: 'user',
                content: prompt
              }
            ],

            reasoning_effort:
              'low',

            response_format: {

              type:
                'json_schema',

              json_schema: {

                name:
                  'citizen_complaint_analysis',

                strict:
                  true,

                schema: {

                  type:
                    'object',

                  additionalProperties:
                    false,

                  properties: {

                    category: {
                      type: 'string',

                      enum: [
                        'Water Supply',
                        'Electricity',
                        'Road Damage',
                        'Garbage',
                        'Drainage',
                        'Sewage',
                        'Streetlight',
                        'Public Transport',
                        'Traffic',
                        'Healthcare',
                        'Public Safety',
                        'Fire Emergency',
                        'Flooding',
                        'Sanitation',
                        'Other Civic Issue'
                      ]
                    },

                    department: {
                      type: 'string',

                      enum: [
                        'Water Board',
                        'Electricity Board',
                        'Municipality',
                        'Public Works Department',
                        'Transport Department',
                        'Health Department',
                        'Police',
                        'Fire and Rescue',
                        'Sanitation Department',
                        'Drainage Department',
                        'Other'
                      ]
                    },

                    summary: {
                      type: 'string'
                    },

                    severity: {
                      type: 'string',

                      enum: [
                        'Critical',
                        'High',
                        'Medium',
                        'Low'
                      ]
                    },

                    emergency: {
                      type: 'boolean'
                    },

                    urgency: {
                      type: 'string'
                    },

                    timeSensitivity: {
                      type: 'string',

                      enum: [
                        'Immediate',
                        'High',
                        'Medium',
                        'Low'
                      ]
                    },

                    sentiment: {
                      type: 'string',

                      enum: [
                        'Positive',
                        'Neutral',
                        'Negative',
                        'Highly Negative'
                      ]
                    },

                    emotion: {
                      type: 'string'
                    },

                    emotionIntensity: {
                      type: 'number',
                      minimum: 0,
                      maximum: 1
                    },

                    keywords: {
                      type: 'array',

                      items: {
                        type: 'string'
                      }
                    },

                    location: {
                      type: 'string'
                    },

                    peopleAffected: {
                      type: [
                        'integer',
                        'null'
                      ]
                    },

                    confidence: {
                      type: 'number',
                      minimum: 0,
                      maximum: 100
                    },

                    estimatedResolution: {
                      type: 'string'
                    },

                    duplicateProbability: {
                      type: 'number',
                      minimum: 0,
                      maximum: 100
                    },

                    suggestedAction: {
                      type: 'string'
                    }
                  },

                  required: [
                    'category',
                    'department',
                    'summary',
                    'severity',
                    'emergency',
                    'urgency',
                    'timeSensitivity',
                    'sentiment',
                    'emotion',
                    'emotionIntensity',
                    'keywords',
                    'location',
                    'peopleAffected',
                    'confidence',
                    'estimatedResolution',
                    'duplicateProbability',
                    'suggestedAction'
                  ]
                }
              }
            }
          },

          {
            headers: {
              Authorization:
                `Bearer ${ENV.GROQ_API_KEY}`,

              'Content-Type':
                'application/json'
            },

            timeout:
              60000
          }
        );

      // =====================================================
      // RESPONSE
      // =====================================================

      const textResponse =
        response.data?.choices?.[0]?.message?.content;

      if (!textResponse) {

        console.error(
          '[GroqAnalysis] Empty Groq response:',
          response.data
        );

        throw new Error(
          'Groq returned an empty analysis response.'
        );
      }

      console.log(
        '[GroqAnalysis] Raw structured response:',
        textResponse
      );

      let parsed:
        Partial<AIAnalysisResult>;

      try {

        parsed =
          JSON.parse(
            textResponse
          );

      } catch (error) {

        console.error(
          '[GroqAnalysis] Invalid JSON:',
          textResponse
        );

        throw new Error(
          'Groq returned invalid analysis JSON.'
        );
      }

      // =====================================================
      // NORMALIZE
      // =====================================================

      const analysis =
        this.normalizeAnalysis(
          parsed,
          cleanedTranscript
        );

      // =====================================================
      // FINAL PRIORITY
      // =====================================================

      const priorityResult =
        PriorityService.calculatePriority({

          severity:
            analysis.severity,

          emergency:
            analysis.emergency,

          timeSensitivity:
            analysis.timeSensitivity,

          sentiment:
            analysis.sentiment,

          emotionIntensity:
            analysis.emotionIntensity,

          peopleAffected:
            analysis.peopleAffected,

          category:
            analysis.category,

          summary:
            analysis.summary
        });

      analysis.priority =
        priorityResult.priority;

      analysis.priorityScore =
        priorityResult.score;

      analysis.priorityReasons =
        priorityResult.reasons;

      // =====================================================
      // FINAL LOG
      // =====================================================

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
        '[GroqAnalysis] Time sensitivity:',
        analysis.timeSensitivity
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
        '[GroqAnalysis] Confidence:',
        analysis.confidence
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
  // NORMALIZE + CIVIC SAFETY RULES
  // =========================================================

  private static normalizeAnalysis(
    parsed: Partial<AIAnalysisResult>,
    transcript: string
  ): AIAnalysisResult {

    const text =
      transcript
        .toLowerCase()
        .trim();

    // =======================================================
    // BASE VALIDATION
    // =======================================================

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

    let severity =
      validSeverities.includes(
        parsed.severity as string
      )
        ? parsed.severity!
        : 'Medium';

    let sentiment =
      validSentiments.includes(
        parsed.sentiment as string
      )
        ? parsed.sentiment!
        : 'Neutral';

    let timeSensitivity =
      validTimeSensitivity.includes(
        parsed.timeSensitivity as string
      )
        ? parsed.timeSensitivity!
        : 'Medium';

    // =======================================================
    // EMOTION INTENSITY
    // =======================================================

    let emotionIntensity =
      typeof parsed.emotionIntensity ===
      'number'
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

    // =======================================================
    // CONFIDENCE
    // =======================================================

    let confidence =
      typeof parsed.confidence ===
      'number'
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

    // =======================================================
    // DUPLICATE PROBABILITY
    // =======================================================

    let duplicateProbability =
      typeof parsed.duplicateProbability ===
      'number'
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

    // =======================================================
    // PEOPLE AFFECTED
    // =======================================================

    const peopleAffected =
      typeof parsed.peopleAffected ===
        'number' &&
      parsed.peopleAffected >= 0
        ? Math.floor(
            parsed.peopleAffected
          )
        : null;

    // =======================================================
    // KEYWORDS
    // =======================================================

    const keywords =
      Array.isArray(parsed.keywords)
        ? parsed.keywords.filter(
            (keyword): keyword is string =>
              typeof keyword === 'string'
          )
        : [];

    // =======================================================
    // CATEGORY
    // =======================================================

    let category =
      parsed.category ||
      'Other Civic Issue';

    // -------------------------------------------------------
    // WATER
    // -------------------------------------------------------

    if (
      this.containsAny(
        text,
        [
          'water scarcity',
          'water shortage',
          'water supply',
          'no water',
          'drinking water',
          'water is not coming',
          'water not coming',
          'water problem',
          'water issue',
          'lack of water',
          'no drinking water'
        ]
      )
    ) {

      category =
        'Water Supply';
    }

    // -------------------------------------------------------
    // ELECTRICITY
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'electricity',
          'power cut',
          'power outage',
          'electric problem',
          'electric issue',
          'no current',
          'transformer',
          'live wire',
          'electrical wire',
          'electric shock',
          'sparking'
        ]
      )
    ) {

      category =
        'Electricity';
    }

    // -------------------------------------------------------
    // ROAD
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'pothole',
          'road damage',
          'damaged road',
          'broken road',
          'road is broken',
          'road problem'
        ]
      )
    ) {

      category =
        'Road Damage';
    }

    // -------------------------------------------------------
    // GARBAGE / SANITATION
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'garbage',
          'trash',
          'waste',
          'overflowing bin',
          'overflowing garbage'
        ]
      )
    ) {

      category =
        'Garbage';
    }

    // -------------------------------------------------------
    // DRAINAGE
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'drainage',
          'drain problem',
          'blocked drain',
          'drain is blocked'
        ]
      )
    ) {

      category =
        'Drainage';
    }

    // -------------------------------------------------------
    // SEWAGE
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'sewage',
          'sewer',
          'sewage overflow'
        ]
      )
    ) {

      category =
        'Sewage';
    }

    // -------------------------------------------------------
    // STREETLIGHT
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'street light',
          'streetlight',
          'street lamp',
          'street lamp not working'
        ]
      )
    ) {

      category =
        'Streetlight';
    }

    // -------------------------------------------------------
    // FIRE
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'fire',
          'fire emergency',
          'building is burning',
          'house is burning'
        ]
      )
    ) {

      category =
        'Fire Emergency';
    }

    // -------------------------------------------------------
    // FLOODING
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'flood',
          'flooding',
          'flood water',
          'street is flooded'
        ]
      )
    ) {

      category =
        'Flooding';
    }

    // -------------------------------------------------------
    // TRAFFIC
    // -------------------------------------------------------

    else if (
      this.containsAny(
        text,
        [
          'traffic jam',
          'traffic problem',
          'traffic signal',
          'signal problem'
        ]
      )
    ) {

      category =
        'Traffic';
    }

    // =======================================================
    // DEPARTMENT — DETERMINISTIC CIVIC ROUTING
    // =======================================================

    let department =
      parsed.department ||
      'Municipality';

    switch (category) {

      case 'Water Supply':
        department =
          'Water Board';
        break;

      case 'Electricity':
        department =
          'Electricity Board';
        break;

      case 'Road Damage':
        department =
          'Public Works Department';
        break;

      case 'Garbage':
        department =
          'Municipality';
        break;

      case 'Drainage':
        department =
          'Drainage Department';
        break;

      case 'Sewage':
        department =
          'Drainage Department';
        break;

      case 'Streetlight':
        department =
          'Municipality';
        break;

      case 'Public Transport':
        department =
          'Transport Department';
        break;

      case 'Traffic':
        department =
          'Police';
        break;

      case 'Healthcare':
        department =
          'Health Department';
        break;

      case 'Public Safety':
        department =
          'Police';
        break;

      case 'Fire Emergency':
        department =
          'Fire and Rescue';
        break;

      case 'Flooding':
        department =
          'Drainage Department';
        break;

      case 'Sanitation':
        department =
          'Sanitation Department';
        break;

      default:

        department =
          department || 'Municipality';
        break;
    }

    // =======================================================
    // EMERGENCY SAFETY RULE
    // =======================================================

    const actualEmergency =
      this.containsAny(
        text,
        [
          'fire',
          'gas leak',
          'gas leakage',
          'live wire',
          'live electrical wire',
          'electrical wire is sparking',
          'electric wire is sparking',
          'sparking wire',
          'building collapse',
          'building collapsed',
          'house collapsed',
          'structural collapse',
          'people are trapped',
          'person trapped',
          'life threatening',
          'life-threatening',
          'immediate danger',
          'major flood',
          'flood water entering houses',
          'severe flooding'
        ]
      );

    /*
     * The AI is NOT allowed to create an emergency merely
     * because it thinks a civic problem is severe.
     *
     * Emergency requires actual emergency evidence.
     */

    let emergency =
      actualEmergency;

    // =======================================================
    // WATER-SCARCITY SAFETY RULE
    // =======================================================

    const isOrdinaryWaterComplaint =
      category === 'Water Supply' &&
      !actualEmergency;

    if (
      isOrdinaryWaterComplaint
    ) {

      emergency =
        false;

      /*
       * Water scarcity without immediate danger should
       * normally be High/Medium, not Critical Emergency.
       */

      if (
        this.containsAny(
          text,
          [
            'severe water scarcity',
            'severe water shortage',
            'no water for',
            'water not available for',
            'water unavailable for',
            'no drinking water for'
          ]
        )
      ) {

        severity =
          'High';

        timeSensitivity =
          'High';

      } else {

        severity =
          'Medium';

        timeSensitivity =
          'High';
      }
    }

    // =======================================================
    // OTHER NON-EMERGENCY SAFETY RULE
    // =======================================================

    if (
      !actualEmergency &&
      severity === 'Critical'
    ) {

      /*
       * Critical without real emergency evidence is too
       * aggressive for this government complaint system.
       *
       * Downgrade to High.
       */

      severity =
        'High';
    }

    if (
      !actualEmergency &&
      timeSensitivity === 'Immediate'
    ) {

      /*
       * Immediate response should require actual danger.
       */

      timeSensitivity =
        'High';
    }

    // =======================================================
    // EMERGENCY CONSISTENCY
    // =======================================================

    if (
      emergency === true
    ) {

      severity =
        'Critical';

      timeSensitivity =
        'Immediate';

    }

    // =======================================================
    // URGENCY TEXT
    // =======================================================

    let urgency =
      parsed.urgency ||
      'Within 24 hours';

    if (
      emergency
    ) {

      urgency =
        'Immediate';

    } else if (
      timeSensitivity === 'High'
    ) {

      urgency =
        'Within 24 hours';

    } else if (
      timeSensitivity === 'Medium'
    ) {

      urgency =
        'Within 48 hours';

    } else {

      urgency =
        'Routine response';
    }

    // =======================================================
    // SUMMARY
    // =======================================================

    let summary =
      parsed.summary ||
      'Citizen reported a civic issue requiring review.';

    // Prevent obviously empty/meaningless summaries.

    if (
      !summary.trim()
    ) {

      summary =
        'Citizen reported a civic issue requiring review.';
    }

    // =======================================================
    // ESTIMATED RESOLUTION
    // =======================================================

    let estimatedResolution =
      parsed.estimatedResolution ||
      'To be determined';

    if (
      isOrdinaryWaterComplaint &&
      (
        !estimatedResolution ||
        estimatedResolution ===
          'Not specified'
      )
    ) {

      estimatedResolution =
        'Within 24 hours';
    }

    // =======================================================
    // RETURN
    // =======================================================

    return {

      category,

      department,

      summary,

      severity,

      emergency,

      urgency,

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

      estimatedResolution,

      duplicateProbability,

      suggestedAction:
        parsed.suggestedAction ||
        'Forward the complaint to the appropriate department for review.',

      priority:
        'Low',

      priorityScore:
        0,

      priorityReasons:
        []
    };
  }

  // =========================================================
  // KEYWORD HELPER
  // =========================================================

  private static containsAny(
    text: string,
    phrases: string[]
  ): boolean {

    return phrases.some(
      (phrase) =>
        text.includes(
          phrase.toLowerCase()
        )
    );
  }
}