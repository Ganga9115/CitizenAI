export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  departmentId?: string | null;
}

export type ComplaintPriority = 'Emergency' | 'High' | 'Medium' | 'Low';
export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export interface AIAnalysisResult {
  category: string;
  priority: ComplaintPriority;
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

export interface Note {
  id: string;
  complaint_id: string;
  author_id: string;
  author_name: string;
  note: string;
  is_internal: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  tracking_number: string;
  citizen_id: string;
  citizen_name?: string;
  audio_url: string;
  audio_duration: number;
  transcript: string;
  summary: string;
  category: string;
  priority: ComplaintPriority;
  department_id?: string | null;
  department_name: string;
  sentiment: string;
  emotion: string;
  confidence: number;
  urgency: string;
  status: ComplaintStatus;
  assigned_officer_id?: string | null;
  assigned_officer_name?: string | null;
  location: string;
  latitude: number;
  longitude: number;
  duplicate_probability: number;
  possible_duplicate_id?: string | null;
  suggested_action: string;
  keywords: string[];
  estimated_resolution: string;
  
  // COMMUNITY IMPACT & SCOREBOARD
  affected_citizens_count: number;
  affected_user_ids: string[];
  is_escalated: boolean;
  feedback_rating?: number | null;
  feedback_comment?: string | null;

  created_at: string;
  updated_at: string;
  notes?: Note[];
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

export interface AnalyticsData {
  overview: {
    totalComplaints: number;
    emergencyComplaints: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    totalAffectedCitizens: number;
    avgResolutionHours: number;
    duplicateReductionPercent: number;
  };
  priorityDistribution: { name: string; value: number; color: string }[];
  departmentDistribution: { name: string; complaints: number }[];
  monthlyTrends: { month: string; emergency: number; total: number }[];
  recentComplaints: Complaint[];
}
