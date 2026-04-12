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

export interface CreateCardRequest {
  bin: string;
  name: string;
  amount: number;
  holder: CardHolderRequest;
}

export interface CardHolderRequest {
  firstName: string;
  lastName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TopupCardRequest {
  amount: number;
  referenceId?: string;
}

export interface WithDrawCardRequest {
  amount: number;
  referenceId?: string;
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
  JCB = 'JCB',
  UNKNOWN = 'UNKNOWN',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CANCELED = 'CANCELED',
}

export interface CardListResponse {
  id: number;
  masked_card: string;
  brand: CardBrand;
  name: string;
  currency: string;
  status: CardStatus;
  remaining_amount: number;
  created_at: string;
  note: string;
}

export interface CardPageResponse {
  items: CardListResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface BalanceResponse {
  wallet_balance: number;
  card_balance: number;
}

export interface DashboardResponse {
  user_id: number;
  total_balance: number;
  available_balance: number;
  frozen_balance: number;
  allocated_balance: number;
  card_opening_limit: number;
  activated_card_count: number;
}
