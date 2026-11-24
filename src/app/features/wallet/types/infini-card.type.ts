import { CardStatus } from './wallet.type';

export type InfiniOrderStatus = 'PENDING' | 'REVIEW_REQUIRED' | 'SUCCEEDED' | 'FAILED';

export const isFinalStatus = (status: InfiniOrderStatus): boolean =>
  status === 'SUCCEEDED' || status === 'FAILED';

// ===== Creation =====
export interface CreateInfiniCardInput {
  name: string;
  amount: number;
  holderName: string;
  note?: string;
}

export interface CreateInfiniCardRequest extends CreateInfiniCardInput {
  requestId: string;
}

export interface CardCreationConfigResponse {
  min_amount: number;
  creation_fee: number;
  available_balance: number;
  max_amount: number;
  can_create: boolean;
  product_ids: number[];
}

export interface CardCreationResponse {
  request_id: string;
  status: InfiniOrderStatus;
  provider: string;
  card_id: number | null;
  amount: number;
  fee: number;
  total_debit: number;
}

// ===== Cards =====
export interface InfiniCardResponse {
  id: number;
  provider: string;
  product_id: number;
  masked_card: string;
  name: string;
  note: string | null;
  currency: string;
  status: CardStatus;
  // Missing on backends without Flyway V16.
  locked_by?: 'USER' | 'ACCOUNT' | 'ADMIN' | null;
  remaining_amount: number;
  created_at: string;
}

export interface InfiniCardPageResponse {
  items: InfiniCardResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

// ===== Top-up / withdraw =====
export type InfiniFundingAction = 'topup' | 'withdraw';

export const INFINI_FUNDING_MIN_AMOUNT = 10;

export interface InfiniFundingRequest {
  requestId: string;
  amount: number;
}

export interface InfiniFundingResponse {
  request_id: string;
  type: 'TOP_UP' | 'REDEEM';
  status: InfiniOrderStatus;
  card_id: number;
  amount: number;
  card_balance: number | null;
}
