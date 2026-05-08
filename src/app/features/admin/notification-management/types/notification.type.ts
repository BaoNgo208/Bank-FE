export interface AnnouncementPageResponse {
  items: AnnouncementResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface AnnouncementResponse {
  id: number;
  title: string;
  content: string;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  link_url?: string | null;
}

export interface UpdateAnnouncementRequest {
  title: string;
  content: string;
  link_url?: string | null;
}
