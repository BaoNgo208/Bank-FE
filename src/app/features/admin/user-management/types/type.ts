export interface AdminUserPageResponse {
  items: AdminUserResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface AdminUserResponse {
  id: number;
  username: string;
  email: string;
  status: AccountStatus;
  card_open_limit: number;
  updated_at: string;
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  DELETED = 'DELETED',
}

export interface UpdateCardOpenLimitRequest {
  card_open_limit: number;
}
