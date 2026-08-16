export interface PriorityInput {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  emergency: boolean;
  timeSensitivity: 'Immediate' | 'High' | 'Medium' | 'Low';

  sentiment:
    | 'Positive'
    | 'Neutral'
    | 'Negative'
    | 'Highly Negative';

  emotionIntensity: number;

  peopleAffected: number | null;

  category: string;

  summary: string;
}

export interface PriorityResult {
  score: number;

  priority:
    | 'Emergency'
    | 'High'
    | 'Medium'
    | 'Low';

  reasons: string[];
}

export class PriorityService {

  /**
   * Calculate final complaint priority.
   *
   * IMPORTANT:
   * Sentiment/emotion has intentionally LOW weight.
   *
   * Emergency and actual severity dominate.
   */
  static calculatePriority(
    input: PriorityInput
  ): PriorityResult {

    let score = 0;

    const reasons: string[] = [];

    // ========================================================
    // 1. EMERGENCY / IMMEDIATE DANGER
    // ========================================================

    if (input.emergency === true) {

      score += 40;

      reasons.push(
        'Immediate emergency or public safety risk detected.'
      );
    }

    // ========================================================
    // 2. SEVERITY
    // ========================================================

    switch (input.severity) {

      case 'Critical':
        score += 30;

        reasons.push(
          'Critical severity identified.'
        );

        break;

      case 'High':
        score += 22;

        reasons.push(
          'High severity identified.'
        );

        break;

      case 'Medium':
        score += 12;

        break;

      case 'Low':
        score += 5;

        break;
    }

    // ========================================================
    // 3. TIME SENSITIVITY
    // ========================================================

    switch (input.timeSensitivity) {

      case 'Immediate':
        score += 15;

        reasons.push(
          'Immediate response is required.'
        );

        break;

      case 'High':
        score += 10;

        break;

      case 'Medium':
        score += 5;

        break;

      case 'Low':
        score += 2;

        break;
    }

    // ========================================================
    // 4. PEOPLE AFFECTED
    // ========================================================

    if (
      typeof input.peopleAffected === 'number' &&
      input.peopleAffected > 0
    ) {

      if (input.peopleAffected >= 500) {

        score += 10;

        reasons.push(
          'Large number of citizens potentially affected.'
        );

      } else if (input.peopleAffected >= 100) {

        score += 8;

        reasons.push(
          'Significant number of citizens potentially affected.'
        );

      } else if (input.peopleAffected >= 50) {

        score += 6;

      } else if (input.peopleAffected >= 10) {

        score += 4;

      } else {

        score += 2;
      }
    }

    // ========================================================
    // 5. ESSENTIAL SERVICES
    // ========================================================

    const essentialServiceCategories = [
      'Water Supply',
      'Electricity',
      'Healthcare',
      'Fire Emergency',
      'Public Safety',
      'Flooding',
      'Gas Leak',
      'Sewage',
      'Drainage'
    ];

    const isEssentialService =
      essentialServiceCategories.some(
        (service) =>
          input.category
            .toLowerCase()
            .includes(service.toLowerCase())
      );

    if (isEssentialService) {

      score += 8;

      reasons.push(
        'Essential public service affected.'
      );
    }

    // ========================================================
    // 6. SENTIMENT / EMOTION
    // ========================================================
    //
    // VERY SMALL WEIGHT ON PURPOSE.
    //
    // Emotion should NEVER turn a normal complaint into
    // Emergency by itself.
    //
    // ========================================================

    const intensity =
      Math.max(
        0,
        Math.min(
          1,
          input.emotionIntensity || 0
        )
      );

    let emotionPoints = 0;

    if (
      input.sentiment === 'Highly Negative'
    ) {

      emotionPoints = Math.round(
        intensity * 4
      );

    } else if (
      input.sentiment === 'Negative'
    ) {

      emotionPoints = Math.round(
        intensity * 3
      );

    } else if (
      input.sentiment === 'Neutral'
    ) {

      emotionPoints = 0;

    } else if (
      input.sentiment === 'Positive'
    ) {

      emotionPoints = 0;
    }

    score += emotionPoints;

    if (emotionPoints >= 3) {

      reasons.push(
        'High emotional distress detected; used only as a supporting signal.'
      );
    }

    // ========================================================
    // FINAL SCORE LIMIT
    // ========================================================

    score = Math.max(
      0,
      Math.min(
        100,
        score
      )
    );

    // ========================================================
    // FINAL PRIORITY
    // ========================================================

    let priority:
      | 'Emergency'
      | 'High'
      | 'Medium'
      | 'Low';

    /*
     * Emergency should require actual emergency conditions.
     *
     * We DON'T want:
     *
     * Angry citizen → Emergency
     *
     */

    if (
      input.emergency === true
    ) {

      priority = 'Emergency';

    } else if (
      input.severity === 'Critical' &&
      input.timeSensitivity === 'Immediate'
    ) {

      priority = 'Emergency';

    } else if (
      score >= 60
    ) {

      priority = 'High';

    } else if (
      score >= 35
    ) {

      priority = 'Medium';

    } else {

      priority = 'Low';
    }

    // ========================================================
    // MAKE SURE REASONS EXIST
    // ========================================================

    if (reasons.length === 0) {

      reasons.push(
        'Complaint does not indicate an immediate high-risk condition.'
      );
    }

    return {
      score,
      priority,
      reasons
    };
  }
}