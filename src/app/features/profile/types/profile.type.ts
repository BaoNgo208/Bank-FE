export interface UserProfileResponse {
  username: string;
  email: string;
  created_at: string;
  card_open_limit: number;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface AdminProfileResponse {
  username: string;
  email: string;
}
