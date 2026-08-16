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

  // Complaint/problem location
  location: string;

  // GPS coordinates captured during complaint submission
  latitude: number | null;
  longitude: number | null;

  // Human-readable GPS location
  gps_address?: string | null;

  duplicate_probability: number;
  possible_duplicate_id?: string | null;

  suggested_action: string;
  keywords: string[];
  estimated_resolution: string;

  // Community impact
  affected_citizens_count: number;
  affected_user_ids: string[];
  is_escalated: boolean;

  // Feedback
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

      latitude: 40.7128,
      longitude: -74.006,

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

      affected_citizens_count: 127,
      affected_user_ids: ['usr-citizen-1'],
      is_escalated: true,

      feedback_rating: null,
      feedback_comment: null,

      created_at: new Date(
        Date.now() - 3600000 * 2
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

      latitude: 40.7282,
      longitude: -73.9942,

      gps_address: 'Sector 4 Market Road Crossing',

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

      latitude: 40.735,
      longitude: -74.012,

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

      latitude: 40.705,
      longitude: -74.018,

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

  logs: any[] = [
    {
      id: 'log-1',

      user_name:
        'Chief Admin Alex Vance',

      action: 'SYSTEM_BOOT',

      details: {
        status:
          'Platform operational with Community Impact Engine'
      },

      ip_address: '127.0.0.1',

      created_at:
        new Date().toISOString()
    }
  ];
}

export const store =
  new InMemoryStore();

export class ComplaintService {

  // =========================================================
  // GPS DISTANCE HELPERS
  // =========================================================

  private static toRadians(
    degrees: number
  ): number {
    return (
      degrees *
      (Math.PI / 180)
    );
  }

  private static calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const earthRadiusKm =
      6371;

    const dLat =
      this.toRadians(
        lat2 - lat1
      );

    const dLon =
      this.toRadians(
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

    return (
      earthRadiusKm *
      c
    );
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
        '[GPS] Converting coordinates to location:',
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
              'accept-language':
                'en'
            },

            headers: {
              'User-Agent':
                'CivicAI-Citizen-Call-Intelligence/1.0'
            },

            timeout: 10000
          }
        );

      const address =
        response.data?.display_name;

      if (
        typeof address === 'string' &&
        address.trim()
      ) {

        console.log(
          '[GPS] Location identified:',
          address
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
  // SIMILAR COMPLAINT CHECK
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
          complaint.status !==
            'Resolved' &&
          complaint.status !==
            'Rejected'
      );

    let bestMatch:
      ComplaintRecord | null =
      null;

    let maxSimilarity = 0;

    const lowerTranscript =
      transcript.toLowerCase();

    const lowerLocation =
      (location || '').toLowerCase();

    for (
      const complaint of activeComplaints
    ) {

      let score = 0;

      // Category match
      if (
        complaint.category.toLowerCase() ===
        category.toLowerCase()
      ) {
        score += 35;
      }

      // Location text match
      if (
        location &&
        lowerLocation !== 'not specified' &&
        complaint.location
          .toLowerCase()
          .includes(
            lowerLocation
          )
      ) {
        score += 40;
      }

      // GPS proximity match
      if (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        typeof complaint.latitude === 'number' &&
        typeof complaint.longitude === 'number'
      ) {

        const distanceKm =
          this.calculateDistanceKm(
            latitude,
            longitude,
            complaint.latitude,
            complaint.longitude
          );

        if (
          distanceKm <= 0.5
        ) {

          score += 20;

        } else if (
          distanceKm <= 1.5
        ) {

          score += 10;
        }
      }

      // Text overlap
      const words =
        lowerTranscript
          .split(/\s+/)
          .filter(
            (word) =>
              word.length > 3
          );

      let matchCount = 0;

      for (
        const word of words
      ) {

        if (
          complaint.summary
            .toLowerCase()
            .includes(word) ||
          complaint.transcript
            .toLowerCase()
            .includes(word)
        ) {
          matchCount++;
        }
      }

      if (
        words.length > 0
      ) {

        score += Math.min(
          25,
          Math.round(
            (matchCount /
              words.length) *
              40
          )
        );
      }

      if (
        score >
        maxSimilarity
      ) {

        maxSimilarity =
          score;

        bestMatch =
          complaint;
      }
    }

    if (
      maxSimilarity >= 65 &&
      bestMatch
    ) {

      return {
        found: true,
        similarity:
          maxSimilarity,
        similarComplaint:
          bestMatch
      };
    }

    return {
      found: false,
      similarity:
        maxSimilarity,
      similarComplaint:
        null
    };
  }

  // =========================================================
  // I'M AFFECTED
  // =========================================================

  static async endorseComplaint(
    complaintId: string,
    userId: string,
    userName?: string
  ) {

    const complaint =
      store.complaints.find(
        (item) =>
          item.id ===
            complaintId ||
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
          item.id ===
            complaintId ||
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
      DepartmentScoreboardItem[] =
      [
        {
          rank: 1,
          id: 'dept-elec',
          name:
            'Electricity Board',
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
          name:
            'Municipality Sanitation',
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
          name:
            'Police Civic Wing',
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
          rank:
            index + 1
        })
      );
  }

  // =========================================================
  // CREATE COMPLAINT
  // =========================================================

  static async createComplaint(
    data: {
      citizenId: string;
      citizenName?: string;

      audioUrl: string;
      audioDuration: number;

      transcript: string;

      analysis:
        AIAnalysisResult;

      customLocation?: string;

      latitude?: number | null;
      longitude?: number | null;
    }
  ): Promise<ComplaintRecord> {

    const trackingNumber =
      `CC-${new Date().getFullYear()}-${Math.floor(
        1000 +
          Math.random() *
            9000
      )}`;

    const deptMatch =
      store.departments.find(
        (department) =>
          department.name
            .toLowerCase() ===
          data.analysis.department
            .toLowerCase()
      );

    // =======================================================
    // GPS
    // =======================================================

    const lat =
      typeof data.latitude ===
      'number'
        ? data.latitude
        : null;

    const lng =
      typeof data.longitude ===
      'number'
        ? data.longitude
        : null;

    console.log(
      '[ComplaintService] GPS:',
      {
        latitude: lat,
        longitude: lng
      }
    );

    // =======================================================
    // COMPLAINT LOCATION
    // =======================================================

    let complaintLocation =
      data.customLocation?.trim() ||
      data.analysis.location?.trim() ||
      '';

    const locationIsMissing =
      !complaintLocation ||
      complaintLocation.toLowerCase() ===
        'not specified';

    let gpsAddress:
      string | null = null;

    if (
      locationIsMissing &&
      lat !== null &&
      lng !== null
    ) {

      gpsAddress =
        await this.reverseGeocode(
          lat,
          lng
        );

      if (gpsAddress) {
        complaintLocation =
          gpsAddress;
      }
    }

    if (!complaintLocation) {
      complaintLocation =
        'Not specified';
    }

    console.log(
      '[ComplaintService] Final complaint location:',
      complaintLocation
    );

    // =======================================================
    // NEW COMPLAINT RECORD
    // =======================================================

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
        data.analysis
          .duplicateProbability,

      possible_duplicate_id:
        data.analysis
          .duplicateProbability >
        60
          ? store.complaints[0]?.id ||
            null
          : null,

      suggested_action:
        data.analysis
          .suggestedAction,

      keywords:
        data.analysis.keywords,

      estimated_resolution:
        data.analysis
          .estimatedResolution,

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

        location:
          newRecord.location,

        latitude:
          lat,

        longitude:
          lng,

        gpsAddress:
          gpsAddress
      },

      ip_address:
        '127.0.0.1',

      created_at:
        new Date().toISOString()
    });

    return newRecord;
  }

  // =========================================================
  // GET COMPLAINTS
  // =========================================================
  //
  // CITIZEN:
  //   Only own/affected complaints
  //
  // OFFICER:
  //   Only complaints belonging to officer's department
  //
  // ADMIN:
  //   All complaints
  //
  // =========================================================

  static async getComplaints(
    filters: {
      category?: string;
      priority?: string;
      department?: string;
      status?: string;
      search?: string;

      // Citizen's user ID
      citizenId?: string;

      // Officer's assigned department
      officerDepartmentId?: string;
    }
  ) {

    let result =
      [...store.complaints];

    // =======================================================
    // CITIZEN FILTER
    // =======================================================

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

    // =======================================================
    // OFFICER DEPARTMENT FILTER
    // =======================================================
    //
    // THIS IS THE IMPORTANT PART.
    //
    // Example:
    //
    // Officer:
    // departmentId = dept-water
    //
    // Complaint:
    // department_id = dept-water
    //
    // Therefore the complaint is visible.
    //
    // Electricity officer:
    // departmentId = dept-elec
    //
    // Water complaint:
    // department_id = dept-water
    //
    // Therefore it is NOT visible.
    //
    // =======================================================

    if (
      filters.officerDepartmentId
    ) {

      result =
        result.filter(
          (complaint) =>
            complaint.department_id ===
            filters.officerDepartmentId
        );

      console.log(
        '[ComplaintService] Officer department filtering:',
        {
          departmentId:
            filters.officerDepartmentId,

          complaintsReturned:
            result.length
        }
      );
    }

    // =======================================================
    // CATEGORY FILTER
    // =======================================================

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

    // =======================================================
    // PRIORITY FILTER
    // =======================================================

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

    // =======================================================
    // DEPARTMENT FILTER
    // =======================================================

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

    // =======================================================
    // STATUS FILTER
    // =======================================================

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

    // =======================================================
    // SEARCH FILTER
    // =======================================================

    if (
      filters.search
    ) {

      const q =
        filters.search
          .toLowerCase();

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
  // GET COMPLAINT BY ID
  // =========================================================

  static async getComplaintById(
    id: string
  ) {

    const complaint =
      store.complaints.find(
        (item) =>
          item.id === id ||
          item.tracking_number ===
            id
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
          item.tracking_number ===
            id
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
          status
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
          item.id ===
            complaintId ||
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
  // ANALYTICS
  // =========================================================

  static async getAnalytics() {

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
          complaint.status ===
            'Pending' ||
          complaint.status ===
            'In Progress'
      ).length;

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
              complaint.priority ===
              'Medium'
          ).length,
        color: '#eab308'
      },

      {
        name: 'Low',
        value:
          store.complaints.filter(
            (complaint) =>
              complaint.priority ===
              'Low'
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
      {
        month: 'Jan',
        emergency: 12,
        total: 140
      },

      {
        month: 'Feb',
        emergency: 18,
        total: 165
      },

      {
        month: 'Mar',
        emergency: 15,
        total: 190
      },

      {
        month: 'Apr',
        emergency: 22,
        total: 210
      },

      {
        month: 'May',
        emergency: 19,
        total: 240
      },

      {
        month: 'Jun',
        emergency: 28,
        total: 310
      },

      {
        month: 'Jul',
        emergency: 34,
        total: 380
      },

      {
        month: 'Aug',
        emergency,
        total
      }
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
          48.5
      },

      priorityDistribution,

      departmentDistribution,

      monthlyTrends,

      recentComplaints:
        store.complaints.slice(
          0,
          5
        )
    };
  }
}