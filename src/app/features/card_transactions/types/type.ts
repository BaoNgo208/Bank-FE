export interface CardTransactionPageResponse {
  items: CardTransactionListResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface CardTransactionListResponse {
  id: number;
  amount: number;
  currency: string;
  status: CardTransactionStatus;
  merchant_description: string;
  slash_transaction_id: string;
  updated_at: string;
}

export enum CardTransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  UNKNOWN = 'UNKNOWN',
}
