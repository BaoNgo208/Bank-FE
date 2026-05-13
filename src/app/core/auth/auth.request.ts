export interface SigninRequest {
  username: string | undefined;
  password: string | undefined;
}

export interface AdminSigninRequest {
  username: string;
  password: string;
  otp: string;
}

export interface AdminLoginOtpRequest {
  username: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface SigninResponse {
  status: number;
  message: string;
  tokens: TokenResponse;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export enum OtpPurpose {
  SIGNIN,
  SIGNUP,
  RESET,
}

export interface OtpRequest {
  email: string;
  purpose: OtpPurpose;
}
