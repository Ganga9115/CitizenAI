import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AIAnalysisResult } from './groq-analysis.service';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
  department_id?: string | null;
  avatar_url?: string;
  created_at: string;
}

export interface ComplaintRecord {
  id: string;
  tracking_number: string;

  citizen_id: string;
  citizen_name?: string;

  audio_url: string;
  audio_duration: number;

  transcript: string;
  summary: string;

  category: string;

  priority:
    | 'Emergency'
    | 'High'
    | 'Medium'
    | 'Low';

  department_id?: string | null;
  department_name: string;

  sentiment: string;
  emotion: string;
  confidence: number;
  urgency: string;

  status:
    | 'Pending'
    | 'Assigned'
    | 'In Progress'
    | 'Resolved'
    | 'Rejected';

  assigned_officer_id?: string | null;
  assigned_officer_name?: string | null;

  location: string;

  latitude: number | null;
  longitude: number | null;

  gps_address?: string | null;

  duplicate_probability: number;
  possible_duplicate_id?: string | null;

  suggested_action: string;
  keywords: string[];
  estimated_resolution: string;

  // =========================================================
  // SLA INFORMATION
  // =========================================================

  sla_hours?: number;
  sla_deadline?: string | null;
  sla_status?: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  sla_breached?: boolean;
  sla_breached_at?: string | null;

  affected_citizens_count: number;
  affected_user_ids: string[];
  is_escalated: boolean;

  feedback_rating?: number | null;
  feedback_comment?: string | null;

  created_at: string;
  updated_at: string;
}

export interface NoteRecord {
  id: string;
  complaint_id: string;
  author_id: string;
  author_name: string;
  note: string;
  is_internal: boolean;
  created_at: string;
}

export interface DepartmentScoreboardItem {
  rank: number;
  id: string;
  name: string;
  code: string;
  citizenRating: number;
  avgResolutionHours: number;
  slaCompliancePercent: number;
  resolutionRatePercent: number;
  reopenRatePercent: number;
  overallScore: number;
  totalComplaints: number;
  resolvedComplaints: number;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type:
    | 'COMPLAINT_CREATED'
    | 'STATUS_UPDATED'
    | 'EMERGENCY_ALERT'
    | 'ASSIGNED';
  is_read: boolean;
  link_url?: string | null;
  created_at: string;
}

class InMemoryStore {
  users: UserRecord[] = [
    {
      id: 'usr-citizen-1',
      email: 'citizen@city.gov',
      password_hash:
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vj.3XJ8c/K',
      full_name: 'John Citizen',
      phone: '+1 555 019 2831',
      role: 'CITIZEN',
      created_at: new Date().toISOString()
    },

    {
      id: 'usr-officer-1',
      email: 'officer@water.gov',
      password_hash:
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vj.3XJ8c/K',
      full_name: 'Officer Sarah Jenkins',
      phone: '+1 555 019 9988',
      role: 'OFFICER',
      department_id: 'dept-water',
      created_at: new Date().toISOString()
    },

    {
      id: 'usr-admin-1',
      email: 'admin@city.gov',
      password_hash:
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vj.3XJ8c/K',
      full_name: 'Chief Admin Alex Vance',
      role: 'ADMIN',
      created_at: new Date().toISOString()
    }
  ];

  departments = [
    {
      id: 'dept-elec',
      name: 'Electricity Board',
      code: 'ELEC',
      contact_email: 'elec@city.gov'
    },
    {
      id: 'dept-water',
      name: 'Water Board',
      code: 'WATER',
      contact_email: 'water@city.gov'
    },
    {
      id: 'dept-pwd',
      name: 'Public Works',
      code: 'PWD',
      contact_email: 'pwd@city.gov'
    },
    {
      id: 'dept-muni',
      name: 'Municipality',
      code: 'MUNI',
      contact_email: 'muni@city.gov'
    },
    {
      id: 'dept-police',
      name: 'Police',
      code: 'POLICE',
      contact_email: 'police@city.gov'
    },
    {
      id: 'dept-fire',
      name: 'Fire Department',
      code: 'FIRE',
      contact_email: 'fire@city.gov'
    },
    {
      id: 'dept-health',
      name: 'Health Department',
      code: 'HEALTH',
      contact_email: 'health@city.gov'
    },
    {
      id: 'dept-trans',
      name: 'Transport Department',
      code: 'TRANS',
      contact_email: 'transport@city.gov'
    }
  ];

  complaints: ComplaintRecord[] = [
    {
      id: 'cmp-101',
      tracking_number: 'CC-2026-8801',
      citizen_id: 'usr-citizen-1',
      citizen_name: 'Anna Nagar Residents',
      audio_url: '/uploads/sample-water-leak.mp3',
      audio_duration: 48,

      transcript:
        'Emergency call! Hello, I am calling from 45 Park Avenue, Ward 12. A massive main water pipeline has burst right in front of our apartment building. The street is completely flooded and water is entering our ground floor basements.',

      summary:
        'Main water supply pipeline burst causing street flooding and basement water ingress at 45 Park Avenue, Ward 12.',

      category: 'Water Supply',
      priority: 'Emergency',

      department_id: 'dept-water',
      department_name: 'Water Board',

      sentiment: 'Highly Critical',
      emotion: 'Panic',
      confidence: 96.5,
      urgency: 'Immediate',

      status: 'In Progress',

      assigned_officer_id: 'usr-officer-1',
      assigned_officer_name: 'Officer Sarah Jenkins',

      location: '45 Park Avenue, Ward 12',

      latitude: 13.362298,
      longitude: 80.144814,

      gps_address: '45 Park Avenue, Ward 12',

      duplicate_probability: 78.5,
      possible_duplicate_id: null,

      suggested_action:
        'Isolate the affected water supply section and dispatch the Water Board emergency team.',

      keywords: [
        'water burst',
        'flooding',
        'park avenue',
        'basement'
      ],

      estimated_resolution: '2 to 4 hours',

      sla_hours: 4,
      sla_deadline: new Date(
        Date.now() - 3600000
      ).toISOString(),
      sla_status: 'BREACHED',
      sla_breached: true,
      sla_breached_at: new Date(
        Date.now() - 1800000
      ).toISOString(),

      affected_citizens_count: 127,
      affected_user_ids: ['usr-citizen-1'],
      is_escalated: true,

      feedback_rating: null,
      feedback_comment: null,

      created_at: new Date(
        Date.now() - 3600000 * 6
      ).toISOString(),

      updated_at: new Date(
        Date.now() - 3600000
      ).toISOString()
    },

    {
      id: 'cmp-102',
      tracking_number: 'CC-2026-8802',
      citizen_id: 'usr-citizen-1',
      citizen_name: 'John Citizen',
      audio_url: '/uploads/sample-transformer.mp3',
      audio_duration: 35,

      transcript:
        'Hi, emergency alert! A heavy tree branch broke and fell on the main transformer wire near Sector 4 Market Road. Sparks are flying everywhere and live electrical cables are dangling on the main road.',

      summary:
        'Heavy tree branch fell on main transformer wire causing live dangling electrical cables and localized power outage.',

      category: 'Electricity',
      priority: 'Emergency',

      department_id: 'dept-elec',
      department_name: 'Electricity Board',

      sentiment: 'Highly Critical',
      emotion: 'Panic',
      confidence: 98.0,
      urgency: 'Immediate',

      status: 'Pending',

      location: 'Sector 4 Market Road Crossing',

      latitude: 13.0827,
      longitude: 80.2707,

      gps_address:
        'Sector 4 Market Road Crossing',

      duplicate_probability: 32.0,
      possible_duplicate_id: null,

      suggested_action:
        'Immediately isolate the affected electrical line and dispatch an emergency electricity crew.',

      keywords: [
        'transformer',
        'live cable',
        'sparks',
        'power outage'
      ],

      estimated_resolution: '1 to 2 hours',

      sla_hours: 2,
      sla_deadline: new Date(
        Date.now() + 3600000
      ).toISOString(),
      sla_status: 'ON_TIME',
      sla_breached: false,
      sla_breached_at: null,

      affected_citizens_count: 48,
      affected_user_ids: ['usr-citizen-1'],
      is_escalated: true,

      feedback_rating: null,
      feedback_comment: null,

      created_at: new Date(
        Date.now() - 3600000 * 5
      ).toISOString(),

      updated_at: new Date(
        Date.now() - 3600000 * 5
      ).toISOString()
    },

    {
      id: 'cmp-103',
      tracking_number: 'CC-2026-8803',
      citizen_id: 'usr-citizen-1',
      citizen_name: 'Mary Watson',
      audio_url: '/uploads/sample-garbage.mp3',
      audio_duration: 52,

      transcript:
        "Hello municipal office, garbage hasn't been collected from 8th Cross Road for over 5 days. Overflowing bins are stinking up the entire street and stray animals are scattering waste everywhere.",

      summary:
        'Uncollected municipal garbage bins overflowing for over 5 days causing sanitation issues on 8th Cross Road.',

      category: 'Garbage',
      priority: 'Medium',

      department_id: 'dept-muni',
      department_name: 'Municipality',

      sentiment: 'Negative',
      emotion: 'Frustration',
      confidence: 91.0,
      urgency: 'Within 24 hours',

      status: 'Assigned',

      location: '8th Cross Road, Ward 7',

      latitude: 13.0827,
      longitude: 80.2707,

      gps_address: '8th Cross Road, Ward 7',

      duplicate_probability: 12.0,
      possible_duplicate_id: null,

      suggested_action:
        'Dispatch the municipal sanitation team to clear the overflowing waste.',

      keywords: [
        'garbage',
        'overflowing bins',
        'sanitation',
        'ward 7'
      ],

      estimated_resolution: '6 to 12 hours',

      sla_hours: 12,
      sla_deadline: new Date(
        Date.now() + 3600000 * 4
      ).toISOString(),
      sla_status: 'ON_TIME',
      sla_breached: false,
      sla_breached_at: null,

      affected_citizens_count: 14,
      affected_user_ids: ['usr-citizen-1'],
      is_escalated: false,

      feedback_rating: null,
      feedback_comment: null,

      created_at: new Date(
        Date.now() - 3600000 * 12
      ).toISOString(),

      updated_at: new Date(
        Date.now() - 3600000 * 8
      ).toISOString()
    },

    {
      id: 'cmp-104',
      tracking_number: 'CC-2026-8804',
      citizen_id: 'usr-citizen-1',
      citizen_name: 'Robert Miller',
      audio_url: '/uploads/sample-pothole.mp3',
      audio_duration: 40,

      transcript:
        'Deep open pothole on Main Flyover Ramp exit 2. Two motorcyclists skid and got injured this morning due to rain water hiding the hole.',

      summary:
        'Hazardous deep pothole on Main Flyover Ramp causing accidents during rainy conditions.',

      category: 'Road Damage',
      priority: 'High',

      department_id: 'dept-pwd',
      department_name: 'Public Works',

      sentiment: 'Negative',
      emotion: 'Anger',
      confidence: 89.0,
      urgency: 'Within 24 hours',

      status: 'Resolved',

      location: 'Main Flyover Ramp, Exit 2',

      latitude: 13.0827,
      longitude: 80.2707,

      gps_address: 'Main Flyover Ramp, Exit 2',

      duplicate_probability: 45.0,
      possible_duplicate_id: null,

      suggested_action:
        'Secure the pothole area and dispatch the road maintenance team for repair.',

      keywords: [
        'pothole',
        'flyover',
        'road hazard',
        'skid danger'
      ],

      estimated_resolution: '12 to 24 hours',

      sla_hours: 24,
      sla_deadline: new Date(
        Date.now() - 3600000 * 12
      ).toISOString(),
      sla_status: 'ON_TIME',
      sla_breached: false,
      sla_breached_at: null,

      affected_citizens_count: 32,
      affected_user_ids: ['usr-citizen-1'],
      is_escalated: false,

      feedback_rating: 5,

      feedback_comment:
        'Repair crew arrived within 4 hours and patched the pothole smoothly. Great service!',

      created_at: new Date(
        Date.now() - 3600000 * 36
      ).toISOString(),

      updated_at: new Date(
        Date.now() - 3600000 * 4
      ).toISOString()
    }
  ];

  notes: NoteRecord[] = [
    {
      id: 'note-1',
      complaint_id: 'cmp-101',
      author_id: 'usr-officer-1',
      author_name: 'Officer Sarah Jenkins',

      note:
        'Hydro team dispatched with high-capacity pumps. Water supply isolation initiated.',

      is_internal: true,

      created_at: new Date(
        Date.now() - 3600000
      ).toISOString()
    }
  ];

  notifications: NotificationRecord[] = [];

  logs: any[] = [
    {
      id: 'log-1',
      user_name: 'Chief Admin Alex Vance',
      action: 'SYSTEM_BOOT',

      details: {
        status:
          'Platform operational with Community Impact Engine'
      },

      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    }
  ];
}

export const store =
  new InMemoryStore();

export class ComplaintService {

  // =========================================================
  // GPS HELPERS
  // =========================================================

  private static toRadians(
    degrees: number
  ): number {
    return degrees * (Math.PI / 180);
  }

  private static calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const earthRadiusKm = 6371;

    const dLat = this.toRadians(
      lat2 - lat1
    );

    const dLon = this.toRadians(
      lon2 - lon1
    );

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(
        this.toRadians(lat1)
      ) *
        Math.cos(
          this.toRadians(lat2)
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadiusKm * c;
  }

  // =========================================================
  // SLA HELPERS
  // =========================================================

  private static getSlaHours(
    priority: ComplaintRecord['priority'],
    estimatedResolution?: string
  ): number {

    if (estimatedResolution) {

      const rangeMatch =
        estimatedResolution.match(
          /(\d+)\s*(?:to|-)\s*(\d+)\s*hours?/i
        );

      if (rangeMatch) {
        return Number(rangeMatch[2]);
      }

      const singleMatch =
        estimatedResolution.match(
          /(\d+)\s*hours?/i
        );

      if (singleMatch) {
        return Number(singleMatch[1]);
      }
    }

    switch (priority) {

      case 'Emergency':
        return 4;

      case 'High':
        return 12;

      case 'Medium':
        return 24;

      case 'Low':
        return 48;

      default:
        return 24;
    }
  }

  private static calculateSlaStatus(
    complaint: ComplaintRecord
  ): 'ON_TIME' | 'AT_RISK' | 'BREACHED' {

    if (
      complaint.status === 'Resolved' ||
      complaint.status === 'Rejected'
    ) {
      return 'ON_TIME';
    }

    if (!complaint.sla_deadline) {
      return 'ON_TIME';
    }

    const deadline =
      new Date(
        complaint.sla_deadline
      ).getTime();

    const now =
      Date.now();

    if (now >= deadline) {
      return 'BREACHED';
    }

    const remaining =
      deadline - now;

    const totalSla =
      (complaint.sla_hours || 24) *
      60 *
      60 *
      1000;

    if (
      remaining <=
      totalSla * 0.25
    ) {
      return 'AT_RISK';
    }

    return 'ON_TIME';
  }

  private static createAdminSlaNotification(
    complaint: ComplaintRecord
  ): void {

    const existingNotification =
      store.notifications.find(
        (notification) =>
          notification.user_id ===
            'usr-admin-1' &&
          notification.type ===
            'EMERGENCY_ALERT' &&
          notification.link_url ===
            `/admin/complaints/${complaint.id}`
      );

    if (existingNotification) {
      return;
    }

    const notification:
      NotificationRecord = {

      id:
        `notification-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

      user_id:
        'usr-admin-1',

      title:
        `SLA Breached - ${complaint.tracking_number}`,

      message:
        `Complaint ${complaint.tracking_number} has exceeded its ${complaint.sla_hours || 24}-hour SLA. Officer: ${
          complaint.assigned_officer_name ||
          'Not Assigned'
        }. Priority: ${complaint.priority}.`,

      type:
        'EMERGENCY_ALERT',

      is_read:
        false,

      link_url:
        `/admin/complaints/${complaint.id}`,

      created_at:
        new Date().toISOString()
    };

    store.notifications.unshift(
      notification
    );

    store.logs.unshift({
      id:
        `log-${Date.now()}-sla`,

      user_name:
        'System Auto-Task',

      action:
        'SLA_BREACHED',

      details: {

        complaintId:
          complaint.tracking_number,

        priority:
          complaint.priority,

        assignedOfficer:
          complaint.assigned_officer_name ||
          'Not Assigned',

        slaHours:
          complaint.sla_hours,

        slaDeadline:
          complaint.sla_deadline,

        breachedAt:
          complaint.sla_breached_at
      },

      ip_address:
        '127.0.0.1',

      created_at:
        new Date().toISOString()
    });
  }

  static checkAndProcessSlaBreaches(): void {

    for (
      const complaint of store.complaints
    ) {

      if (
        complaint.status === 'Resolved' ||
        complaint.status === 'Rejected'
      ) {
        continue;
      }

      if (!complaint.sla_deadline) {
        continue;
      }

      const slaStatus =
        this.calculateSlaStatus(
          complaint
        );

      complaint.sla_status =
        slaStatus;

      if (
        slaStatus === 'BREACHED' &&
        !complaint.sla_breached
      ) {

        complaint.sla_breached =
          true;

        complaint.sla_breached_at =
          new Date().toISOString();

        this.createAdminSlaNotification(
          complaint
        );
      }
    }
  }

  // =========================================================
  // REVERSE GEOCODING
  // =========================================================

  private static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string | null> {

    try {

      console.log(
        '[GPS] Reverse geocoding coordinates:',
        {
          latitude,
          longitude
        }
      );

      const response =
        await axios.get(
          'https://nominatim.openstreetmap.org/reverse',
          {
            params: {
              lat: latitude,
              lon: longitude,
              format: 'jsonv2',
              addressdetails: 1,
              zoom: 18,
              'accept-language': 'en'
            },

            headers: {
              'User-Agent':
                'CivicAI-Citizen-Call-Intelligence/1.0'
            },

            timeout: 15000
          }
        );

      const address =
        response.data?.display_name;

      if (
        typeof address === 'string' &&
        address.trim()
      ) {

        console.log(
          '[GPS] Reverse geocoding result:',
          address.trim()
        );

        return address.trim();
      }

      console.warn(
        '[GPS] Reverse geocoding returned no address.'
      );

      return null;

    } catch (error: any) {

      console.warn(
        '[GPS] Reverse geocoding failed:',
        error.response?.data ||
          error.message
      );

      return null;
    }
  }

  // =========================================================
  // TEXT NORMALIZATION
  // =========================================================

  private static getMeaningfulWords(
    text: string
  ): string[] {

    const stopWords = new Set([
      'this',
      'that',
      'there',
      'their',
      'about',
      'with',
      'from',
      'have',
      'been',
      'they',
      'were',
      'what',
      'when',
      'where',
      'which',
      'please',
      'hello',
      'problem',
      'area',
      'issue',
      'facing',
      'currently',
      'today',
      'yesterday',
      'really',
      'very'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(
        (word) =>
          word.length >= 4 &&
          !stopWords.has(word)
      );
  }

  // =========================================================
  // SIMILAR COMPLAINT DETECTION
  // =========================================================

  static async findSimilarComplaint(
    transcript: string,
    category: string,
    location?: string,
    latitude?: number | null,
    longitude?: number | null
  ) {

    const activeComplaints =
      store.complaints.filter(
        (complaint) =>
          complaint.status !== 'Resolved' &&
          complaint.status !== 'Rejected'
      );

    let bestMatch:
      ComplaintRecord | null = null;

    let bestScore = 0;

    const currentWords =
      this.getMeaningfulWords(
        transcript
      );

    const uniqueCurrentWords =
      [...new Set(currentWords)];

    const normalizedCategory =
      category
        .toLowerCase()
        .trim();

    const normalizedLocation =
      (location || '')
        .toLowerCase()
        .trim();

    console.log(
      '[DuplicateDetection] New complaint:',
      {
        category,
        transcript,
        location,
        latitude,
        longitude,
        meaningfulWords:
          uniqueCurrentWords
      }
    );

    for (
      const complaint of activeComplaints
    ) {

      const sameCategory =
        complaint.category
          .toLowerCase()
          .trim() ===
        normalizedCategory;

      if (!sameCategory) {
        continue;
      }

      let score = 35;

      let gpsClose = false;

      let distanceKm:
        number | null = null;

      if (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        typeof complaint.latitude === 'number' &&
        typeof complaint.longitude === 'number'
      ) {

        distanceKm =
          this.calculateDistanceKm(
            latitude,
            longitude,
            complaint.latitude,
            complaint.longitude
          );

        console.log(
          '[DuplicateDetection] GPS comparison:',
          {
            newComplaint:
              `${latitude}, ${longitude}`,

            existingComplaint:
              complaint.tracking_number,

            distanceKm
          }
        );

        if (
          distanceKm <= 0.25
        ) {

          score += 25;
          gpsClose = true;

        } else if (
          distanceKm <= 0.5
        ) {

          score += 15;
          gpsClose = true;

        } else if (
          distanceKm <= 1.5
        ) {

          score += 5;
        }
      }

      let textLocationMatch =
        false;

      if (
        normalizedLocation &&
        normalizedLocation !==
          'not specified'
      ) {

        const existingLocation =
          complaint.location
            .toLowerCase()
            .trim();

        if (
          existingLocation ===
            normalizedLocation ||
          existingLocation.includes(
            normalizedLocation
          ) ||
          normalizedLocation.includes(
            existingLocation
          )
        ) {

          score += 20;

          textLocationMatch =
            true;
        }
      }

      const existingWords =
        this.getMeaningfulWords(
          complaint.transcript +
            ' ' +
            complaint.summary
        );

      const uniqueExistingWords =
        [...new Set(existingWords)];

      let matchedWords =
        0;

      const matchedWordList:
        string[] = [];

      for (
        const word of uniqueCurrentWords
      ) {

        if (
          uniqueExistingWords.includes(
            word
          )
        ) {

          matchedWords++;

          matchedWordList.push(
            word
          );
        }
      }

      const textSimilarity =
        uniqueCurrentWords.length > 0
          ? matchedWords /
            uniqueCurrentWords.length
          : 0;

      const genericWords =
        new Set([
          'water',
          'electricity',
          'power',
          'road',
          'street',
          'garbage',
          'supply',
          'problem',
          'service',
          'issue',
          'drainage',
          'sewage'
        ]);

      const meaningfulMatchList =
        matchedWordList.filter(
          (word) =>
            !genericWords.has(word)
        );

      const meaningfulMatchCount =
        meaningfulMatchList.length;

      const strongTextSimilarity =
        textSimilarity >= 0.40 &&
        meaningfulMatchCount >= 1;

      const veryStrongTextSimilarity =
        textSimilarity >= 0.60 &&
        matchedWords >= 2;

      const textScore =
        Math.min(
          20,
          Math.round(
            textSimilarity * 40
          )
        );

      score += textScore;

      const strongGpsDuplicate =
        sameCategory &&
        gpsClose &&
        (
          strongTextSimilarity ||
          veryStrongTextSimilarity
        );

      const strongLocationDuplicate =
        sameCategory &&
        textLocationMatch &&
        (
          strongTextSimilarity ||
          veryStrongTextSimilarity
        );

      const finalDuplicate =
        strongGpsDuplicate ||
        strongLocationDuplicate;

      console.log(
        '[DuplicateDetection] Candidate:',
        {
          trackingNumber:
            complaint.tracking_number,

          categoryMatch:
            sameCategory,

          gpsClose,

          distanceKm,

          locationMatch:
            textLocationMatch,

          matchedWords:
            matchedWordList,

          meaningfulMatchedWords:
            meaningfulMatchList,

          matchedWordCount:
            matchedWords,

          meaningfulMatchCount,

          textSimilarity:
            Math.round(
              textSimilarity * 100
            ),

          score,

          strongTextSimilarity,

          veryStrongTextSimilarity,

          duplicate:
            finalDuplicate
        }
      );

      if (
        finalDuplicate &&
        score > bestScore
      ) {

        bestScore =
          score;

        bestMatch =
          complaint;
      }
    }

    if (
      bestMatch &&
      bestScore >= 65
    ) {

      console.log(
        '[DuplicateDetection] DUPLICATE FOUND:',
        {
          trackingNumber:
            bestMatch.tracking_number,

          score:
            bestScore
        }
      );

      return {
        found: true,

        similarity:
          bestScore,

        similarComplaint:
          bestMatch
      };
    }

    console.log(
      '[DuplicateDetection] No sufficiently similar complaint found.',
      {
        bestScore
      }
    );

    return {
      found: false,

      similarity:
        bestScore,

      similarComplaint:
        null
    };
  }

  // =========================================================
  // ENDORSE / I'M AFFECTED
  // =========================================================

  static async endorseComplaint(
    complaintId: string,
    userId: string,
    userName?: string
  ) {

    const complaint =
      store.complaints.find(
        (item) =>
          item.id === complaintId ||
          item.tracking_number ===
            complaintId
      );

    if (!complaint) {
      return null;
    }

    if (
      !complaint.affected_user_ids.includes(
        userId
      )
    ) {

      complaint.affected_user_ids.push(
        userId
      );

      complaint.affected_citizens_count +=
        1;
    }

    complaint.updated_at =
      new Date().toISOString();

    this.applyCommunityEscalation(
      complaint
    );

    store.logs.unshift({
      id:
        `log-${Date.now()}`,

      user_name:
        userName ||
        'Citizen User',

      action:
        'IM_AFFECTED_ENDORSEMENT',

      details: {
        complaintTracking:
          complaint.tracking_number,

        newAffectedCount:
          complaint.affected_citizens_count,

        priority:
          complaint.priority
      },

      ip_address:
        '127.0.0.1',

      created_at:
        new Date().toISOString()
    });

    return complaint;
  }

  // =========================================================
  // COMMUNITY ESCALATION
  // =========================================================

  private static applyCommunityEscalation(
    complaint: ComplaintRecord
  ) {

    if (
      complaint.affected_citizens_count >=
        20 &&
      complaint.priority !==
        'Emergency'
    ) {

      complaint.priority =
        'Emergency';

      complaint.is_escalated =
        true;

    } else if (
      complaint.affected_citizens_count >=
        10 &&
      complaint.priority ===
        'Low'
    ) {

      complaint.priority =
        'High';

      complaint.is_escalated =
        true;
    }
  }

  // =========================================================
  // FEEDBACK
  // =========================================================

  static async submitFeedback(
    complaintId: string,
    rating: number,
    comment?: string
  ) {

    const complaint =
      store.complaints.find(
        (item) =>
          item.id === complaintId ||
          item.tracking_number ===
            complaintId
      );

    if (!complaint) {
      return null;
    }

    complaint.feedback_rating =
      rating;

    complaint.feedback_comment =
      comment || '';

    complaint.updated_at =
      new Date().toISOString();

    return complaint;
  }

  // =========================================================
  // DEPARTMENT SCOREBOARD
  // =========================================================

  static async getScoreboard():
    Promise<DepartmentScoreboardItem[]> {

    const list:
      DepartmentScoreboardItem[] = [

      {
        rank: 1,
        id: 'dept-elec',
        name: 'Electricity Board',
        code: 'ELEC',
        citizenRating: 4.7,
        avgResolutionHours: 2.8,
        slaCompliancePercent: 96.2,
        resolutionRatePercent: 94.5,
        reopenRatePercent: 2.1,
        overallScore: 93,
        totalComplaints: 284,
        resolvedComplaints: 268
      },

      {
        rank: 2,
        id: 'dept-water',
        name: 'Water Board',
        code: 'WATER',
        citizenRating: 4.5,
        avgResolutionHours: 3.5,
        slaCompliancePercent: 91.8,
        resolutionRatePercent: 92.0,
        reopenRatePercent: 3.4,
        overallScore: 89,
        totalComplaints: 342,
        resolvedComplaints: 315
      },

      {
        rank: 3,
        id: 'dept-pwd',
        name: 'Public Works',
        code: 'PWD',
        citizenRating: 4.2,
        avgResolutionHours: 5.2,
        slaCompliancePercent: 86.4,
        resolutionRatePercent: 88.0,
        reopenRatePercent: 4.8,
        overallScore: 84,
        totalComplaints: 198,
        resolvedComplaints: 174
      },

      {
        rank: 4,
        id: 'dept-muni',
        name: 'Municipality Sanitation',
        code: 'MUNI',
        citizenRating: 4.0,
        avgResolutionHours: 6.8,
        slaCompliancePercent: 82.5,
        resolutionRatePercent: 85.2,
        reopenRatePercent: 5.6,
        overallScore: 80,
        totalComplaints: 410,
        resolvedComplaints: 349
      },

      {
        rank: 5,
        id: 'dept-police',
        name: 'Police Civic Wing',
        code: 'POLICE',
        citizenRating: 4.3,
        avgResolutionHours: 1.5,
        slaCompliancePercent: 94.0,
        resolutionRatePercent: 90.1,
        reopenRatePercent: 2.9,
        overallScore: 88,
        totalComplaints: 156,
        resolvedComplaints: 141
      }
    ];

    return list
      .sort(
        (a, b) =>
          b.overallScore -
          a.overallScore
      )
      .map(
        (item, index) => ({
          ...item,
          rank: index + 1
        })
      );
  }

  // =========================================================
  // CREATE OR MERGE COMPLAINT
  // =========================================================

  static async createComplaint(
    data: {
      citizenId: string;
      citizenName?: string;

      audioUrl: string;
      audioDuration: number;

      transcript: string;

      analysis: AIAnalysisResult;

      customLocation?: string;

      latitude?: number | null;
      longitude?: number | null;
    }
  ): Promise<{
    complaint: ComplaintRecord;
    merged: boolean;
    similarity: number;
  }> {

    const lat =
      typeof data.latitude === 'number'
        ? data.latitude
        : null;

    const lng =
      typeof data.longitude === 'number'
        ? data.longitude
        : null;

    console.log(
      '[ComplaintService] Incoming GPS:',
      {
        latitude:
          lat,

        longitude:
          lng,

        customLocation:
          data.customLocation,

        analysisLocation:
          data.analysis?.location
      }
    );

    let gpsAddress:
      string | null = null;

    if (
      lat !== null &&
      lng !== null
    ) {

      gpsAddress =
        await this.reverseGeocode(
          lat,
          lng
        );
    }

    console.log(
      '[ComplaintService] Resolved GPS address:',
      gpsAddress
    );

    const duplicateLocation =
      gpsAddress ||
      data.customLocation ||
      data.analysis.location ||
      'Not specified';

    const duplicateResult =
      await this.findSimilarComplaint(
        data.transcript,
        data.analysis.category,
        duplicateLocation,
        lat,
        lng
      );

    if (
      duplicateResult.found &&
      duplicateResult.similarComplaint
    ) {

      const existingComplaint =
        duplicateResult.similarComplaint;

      console.log(
        '[ComplaintService] MERGING INTO EXISTING COMPLAINT:',
        existingComplaint.tracking_number
      );

      if (
        !existingComplaint.affected_user_ids.includes(
          data.citizenId
        )
      ) {

        existingComplaint.affected_user_ids.push(
          data.citizenId
        );

        existingComplaint.affected_citizens_count +=
          1;
      }

      if (
        lat !== null &&
        lng !== null
      ) {

        existingComplaint.latitude =
          lat;

        existingComplaint.longitude =
          lng;

        if (gpsAddress) {

          existingComplaint.gps_address =
            gpsAddress;

          existingComplaint.location =
            gpsAddress;

        } else if (
          !existingComplaint.location ||
          existingComplaint.location ===
            'Not specified'
        ) {

          existingComplaint.location =
            data.customLocation ||
            data.analysis.location ||
            'Not specified';
        }
      }

      existingComplaint.updated_at =
        new Date().toISOString();

      existingComplaint.duplicate_probability =
        Math.max(
          existingComplaint.duplicate_probability,
          duplicateResult.similarity
        );

      existingComplaint.possible_duplicate_id =
        null;

      this.applyCommunityEscalation(
        existingComplaint
      );

      store.logs.unshift({
        id:
          `log-${Date.now()}`,

        user_name:
          data.citizenName ||
          'Citizen User',

        action:
          'COMPLAINT_MERGED',

        details: {
          existingTrackingNumber:
            existingComplaint.tracking_number,

          similarity:
            duplicateResult.similarity,

          affectedCitizensCount:
            existingComplaint.affected_citizens_count,

          category:
            existingComplaint.category,

          latitude:
            lat,

          longitude:
            lng,

          gpsAddress
        },

        ip_address:
          '127.0.0.1',

        created_at:
          new Date().toISOString()
      });

      return {
        complaint:
          existingComplaint,

        merged:
          true,

        similarity:
          duplicateResult.similarity
      };
    }

    const trackingNumber =
      `CC-${new Date().getFullYear()}-${Math.floor(
        1000 +
          Math.random() * 9000
      )}`;

    const deptMatch =
      store.departments.find(
        (department) =>
          department.name
            .toLowerCase() ===
          data.analysis.department
            .toLowerCase()
      );

    const customLocation =
      data.customLocation?.trim() || '';

    const aiLocation =
      data.analysis.location?.trim() || '';

    const hasGpsAddress =
      typeof gpsAddress === 'string' &&
      gpsAddress.trim().length > 0;

    let complaintLocation =
      hasGpsAddress
        ? gpsAddress!.trim()
        : customLocation ||
          aiLocation ||
          'Not specified';

    if (hasGpsAddress) {

      complaintLocation =
        gpsAddress!.trim();
    }

    console.log(
      '[ComplaintService] Final complaint location:',
      {
        complaintLocation,
        gpsAddress,
        customLocation,
        aiLocation
      }
    );

    const slaHours =
      this.getSlaHours(
        data.analysis.priority,
        data.analysis.estimatedResolution
      );

    const slaDeadline =
      new Date(
        Date.now() +
        slaHours *
        60 *
        60 *
        1000
      ).toISOString();

    const newRecord:
      ComplaintRecord = {

      id:
        `cmp-${uuidv4().substring(0, 8)}`,

      tracking_number:
        trackingNumber,

      citizen_id:
        data.citizenId,

      citizen_name:
        data.citizenName ||
        'John Citizen',

      audio_url:
        data.audioUrl,

      audio_duration:
        data.audioDuration,

      transcript:
        data.transcript,

      summary:
        data.analysis.summary,

      category:
        data.analysis.category,

      priority:
        data.analysis.priority,

      department_id:
        deptMatch?.id ||
        'dept-pwd',

      department_name:
        data.analysis.department,

      sentiment:
        data.analysis.sentiment,

      emotion:
        data.analysis.emotion,

      confidence:
        data.analysis.confidence,

      urgency:
        data.analysis.urgency,

      status:
        'Pending',

      assigned_officer_id:
        null,

      assigned_officer_name:
        null,

      location:
        complaintLocation,

      latitude:
        lat,

      longitude:
        lng,

      gps_address:
        gpsAddress,

      duplicate_probability:
        data.analysis.duplicateProbability,

      possible_duplicate_id:
        null,

      suggested_action:
        data.analysis.suggestedAction,

      keywords:
        data.analysis.keywords,

      estimated_resolution:
        data.analysis.estimatedResolution,

      sla_hours:
        slaHours,

      sla_deadline:
        slaDeadline,

      sla_status:
        'ON_TIME',

      sla_breached:
        false,

      sla_breached_at:
        null,

      affected_citizens_count:
        1,

      affected_user_ids: [
        data.citizenId
      ],

      is_escalated:
        false,

      feedback_rating:
        null,

      feedback_comment:
        null,

      created_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString()
    };

    store.complaints.unshift(
      newRecord
    );

    store.logs.unshift({
      id:
        `log-${Date.now()}`,

      user_name:
        data.citizenName ||
        'Citizen User',

      action:
        'COMPLAINT_RAISED',

      details: {
        trackingNumber,

        category:
          newRecord.category,

        priority:
          newRecord.priority,

        department:
          newRecord.department_name,

        location:
          newRecord.location,

        gpsAddress:
          newRecord.gps_address,

        latitude:
          lat,

        longitude:
          lng,

        slaHours:
          newRecord.sla_hours,

        slaDeadline:
          newRecord.sla_deadline
      },

      ip_address:
        '127.0.0.1',

      created_at:
        new Date().toISOString()
    });

    return {
      complaint:
        newRecord,

      merged:
        false,

      similarity:
        0
    };
  }

  // =========================================================
  // GET COMPLAINTS
  // =========================================================

  static async getComplaints(
    filters: {
      category?: string;
      priority?: string;
      department?: string;
      status?: string;
      search?: string;
      citizenId?: string;
      officerDepartmentId?: string;
    }
  ) {

    this.checkAndProcessSlaBreaches();

    let result =
      [...store.complaints];

    if (
      filters.citizenId
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.citizen_id ===
              filters.citizenId ||
            complaint.affected_user_ids.includes(
              filters.citizenId!
            )
        );
    }

    if (
      filters.officerDepartmentId
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.department_id ===
            filters.officerDepartmentId
        );
    }

    if (
      filters.category &&
      filters.category !== 'All'
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.category
              .toLowerCase() ===
            filters.category!
              .toLowerCase()
        );
    }

    if (
      filters.priority &&
      filters.priority !== 'All'
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.priority
              .toLowerCase() ===
            filters.priority!
              .toLowerCase()
        );
    }

    if (
      filters.department &&
      filters.department !== 'All'
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.department_name
              .toLowerCase()
              .includes(
                filters.department!
                  .toLowerCase()
              )
        );
    }

    if (
      filters.status &&
      filters.status !== 'All'
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.status
              .toLowerCase() ===
            filters.status!
              .toLowerCase()
        );
    }

    if (
      filters.search
    ) {

      const q =
        filters.search.toLowerCase();

      result =
        result.filter(
          (complaint) =>
            complaint.tracking_number
              .toLowerCase()
              .includes(q) ||

            complaint.summary
              .toLowerCase()
              .includes(q) ||

            complaint.location
              .toLowerCase()
              .includes(q) ||

            complaint.transcript
              .toLowerCase()
              .includes(q)
        );
    }

    return result;
  }

  // =========================================================
  // GET COMPLAINT
  // =========================================================

  static async getComplaintById(
    id: string
  ) {

    this.checkAndProcessSlaBreaches();

    const complaint =
      store.complaints.find(
        (item) =>
          item.id === id ||
          item.tracking_number === id
      );

    if (!complaint) {
      return null;
    }

    const notes =
      store.notes.filter(
        (note) =>
          note.complaint_id ===
          complaint.id
      );

    return {
      ...complaint,
      notes
    };
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  static async updateStatus(
    id: string,
    status:
      | 'Pending'
      | 'Assigned'
      | 'In Progress'
      | 'Resolved'
      | 'Rejected',
    officerId?: string,
    officerName?: string
  ) {

    const complaint =
      store.complaints.find(
        (item) =>
          item.id === id ||
          item.tracking_number === id
      );

    if (!complaint) {
      return null;
    }

    complaint.status =
      status;

    complaint.updated_at =
      new Date().toISOString();

    if (officerId) {

      complaint.assigned_officer_id =
        officerId;

      complaint.assigned_officer_name =
        officerName ||
        'Department Officer';
    }

    if (
      status === 'Resolved' ||
      status === 'Rejected'
    ) {

      complaint.sla_status =
        'ON_TIME';
    } else {

      complaint.sla_status =
        this.calculateSlaStatus(
          complaint
        );

      if (
        complaint.sla_status ===
        'BREACHED'
      ) {

        if (!complaint.sla_breached) {

          complaint.sla_breached =
            true;

          complaint.sla_breached_at =
            new Date().toISOString();

          this.createAdminSlaNotification(
            complaint
          );
        }
      }
    }

    store.logs.unshift({
      id:
        `log-${Date.now()}`,

      user_name:
        officerName ||
        'Officer',

      action:
        'STATUS_UPDATED',

      details: {
        complaintId:
          complaint.tracking_number,

        newStatus:
          status,

        slaStatus:
          complaint.sla_status,

        slaDeadline:
          complaint.sla_deadline
      },

      ip_address:
        '127.0.0.1',

      created_at:
        new Date().toISOString()
    });

    return complaint;
  }

  // =========================================================
  // ADD NOTE
  // =========================================================

  static async addNote(
    complaintId: string,
    authorId: string,
    authorName: string,
    note: string
  ) {

    const complaint =
      store.complaints.find(
        (item) =>
          item.id === complaintId ||
          item.tracking_number ===
            complaintId
      );

    if (!complaint) {
      return null;
    }

    const newNote:
      NoteRecord = {

      id:
        `note-${Date.now()}`,

      complaint_id:
        complaint.id,

      author_id:
        authorId,

      author_name:
        authorName,

      note,

      is_internal:
        true,

      created_at:
        new Date().toISOString()
    };

    store.notes.push(
      newNote
    );

    return newNote;
  }

  // =========================================================
  // ADMIN NOTIFICATIONS
  // =========================================================

  static async getAdminNotifications() {

    this.checkAndProcessSlaBreaches();

    return store.notifications
      .filter(
        (notification) =>
          notification.user_id ===
          'usr-admin-1'
      );
  }

  static async markNotificationRead(
    notificationId: string
  ) {

    const notification =
      store.notifications.find(
        (item) =>
          item.id ===
          notificationId
      );

    if (!notification) {
      return null;
    }

    notification.is_read =
      true;

    return notification;
  }

  // =========================================================
  // ANALYTICS
  // =========================================================

  static async getAnalytics() {

    this.checkAndProcessSlaBreaches();

    const total =
      store.complaints.length;

    const emergency =
      store.complaints.filter(
        (complaint) =>
          complaint.priority ===
          'Emergency'
      ).length;

    const high =
      store.complaints.filter(
        (complaint) =>
          complaint.priority ===
          'High'
      ).length;

    const resolved =
      store.complaints.filter(
        (complaint) =>
          complaint.status ===
          'Resolved'
      ).length;

    const pending =
      store.complaints.filter(
        (complaint) =>
          complaint.status === 'Pending' ||
          complaint.status === 'In Progress'
      ).length;

    const slaBreached =
      store.complaints.filter(
        (complaint) =>
          complaint.sla_status ===
          'BREACHED'
      ).length;

    const slaAtRisk =
      store.complaints.filter(
        (complaint) =>
          complaint.sla_status ===
          'AT_RISK'
      ).length;

    const slaCompleted =
      store.complaints.filter(
        (complaint) =>
          (
            complaint.status ===
            'Resolved'
          ) &&
          complaint.sla_breached !==
            true
      ).length;

    const slaCompliancePercent =
      resolved > 0
        ? Number(
            (
              (
                slaCompleted /
                resolved
              ) *
              100
            ).toFixed(1)
          )
        : 100;

    const totalAffectedCitizens =
      store.complaints.reduce(
        (totalCount, complaint) =>
          totalCount +
          complaint.affected_citizens_count,
        0
      );

    const priorityDistribution = [
      {
        name: 'Emergency',
        value: emergency,
        color: '#ef4444'
      },
      {
        name: 'High',
        value: high,
        color: '#f97316'
      },
      {
        name: 'Medium',
        value:
          store.complaints.filter(
            (complaint) =>
              complaint.priority === 'Medium'
          ).length,
        color: '#eab308'
      },
      {
        name: 'Low',
        value:
          store.complaints.filter(
            (complaint) =>
              complaint.priority === 'Low'
          ).length,
        color: '#3b82f6'
      }
    ];

    const deptMap:
      Record<string, number> =
      {};

    store.complaints.forEach(
      (complaint) => {

        deptMap[
          complaint.department_name
        ] =
          (
            deptMap[
              complaint.department_name
            ] || 0
          ) + 1;
      }
    );

    const departmentDistribution =
      Object.keys(
        deptMap
      ).map(
        (department) => ({
          name: department,
          complaints:
            deptMap[department]
        })
      );

    const monthlyTrends = [
      { month: 'Jan', emergency: 12, total: 140 },
      { month: 'Feb', emergency: 18, total: 165 },
      { month: 'Mar', emergency: 15, total: 190 },
      { month: 'Apr', emergency: 22, total: 210 },
      { month: 'May', emergency: 19, total: 240 },
      { month: 'Jun', emergency: 28, total: 310 },
      { month: 'Jul', emergency: 34, total: 380 },
      { month: 'Aug', emergency, total }
    ];

    return {
      overview: {
        totalComplaints:
          total,

        emergencyComplaints:
          emergency,

        resolvedComplaints:
          resolved,

        pendingComplaints:
          pending,

        totalAffectedCitizens,

        avgResolutionHours:
          3.4,

        duplicateReductionPercent:
          48.5,

        slaBreachedComplaints:
          slaBreached,

        slaAtRiskComplaints:
          slaAtRisk,

        slaCompliancePercent
      },

      priorityDistribution,

      departmentDistribution,

      monthlyTrends,

      recentComplaints:
        store.complaints.slice(0, 5)
    };
  }
}