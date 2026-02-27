export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

export type EventType = {
  id: number;
  date: string;
  start_time: string;
  type: string;
  note: string | null;
  created_at: string;
};

export type AttendanceStatus = "yes" | "maybe" | "no";

export type AttendanceType = {
  id: number;
  event_id: number;
  user_id: string;
  status: AttendanceStatus;
  comment: string | null;
  updated_at: string;
};

export type MatchType = {
  id: number;
  date: string;
  season: string;
  created_by: string;
  is_approved: boolean;
  player_a: string;
  player_b: string;
  score_a: number;
  score_b: number;
  created_at: string;
};

export type AnnouncementType = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  created_by: string | null;
};

export type Profile = {
  id: string;
  name: string;
  role: "member" | "admin";
  created_at: string;
};

export type GalleryImage = {
  name: string;
  publicUrl: string;
  created_at?: string;
};

export type RankingRow = {
  name: string;
  points: number;
  diff: number;
  played: number;
  wins: number;
};
