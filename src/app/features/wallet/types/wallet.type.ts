export interface DepositConfigResponse {
  balance: number;
  fee_percent: number;
  min_amount: number;
  max_amount: number;
}

export enum Stablecoin {
  USDT = 'USDT',
  USDC = 'USDC',
}

export interface DepositPreviewRequest {
  currency: Stablecoin;
  amount: number;
  network: string;
}

export interface DepositPreviewResponse {
  payee_name: string;
  network: string;
  address: string;
  amount: number;
  fee: number;
  expected_amount: number;
  currency: Stablecoin;
}

export interface CreateDepositOrderRequest {
  currency: Stablecoin;
  amount: number;
  network: string;
}

export interface CreateDepositOrderResponse {
  order_no: string;
  currency: Stablecoin;
  network: string;
  address: string;
  amount: number;
  fee: number;
  expected_amount: number;
  status: string;
}

export interface DepositOrderListResponse {
  order_no: string;
  currency: Stablecoin;
  network: string;
  address: string;
  amount: number;
  expected_amount: number;
  status: string;
  admin_note: string | null;
  created_at: string;
}

export interface DepositOrderPageResponse {
  items: DepositOrderListResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export enum WithdrawOrderStatus {
  PENDING_OTP = 'PENDING_OTP',
  PENDING_ADMIN = 'PENDING_ADMIN',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface CreateWithdrawOrderResponse {
  order_no: string;
  amount: string;
  status: WithdrawOrderStatus;
}

export interface CreateWithdrawOrderRequest {
  currency: Stablecoin;
  network: string;
  to_address: string;
  amount: number;
}

export interface ConfirmWithdrawOtpRequest {
  orderNo: string;
  otp: string;
}
