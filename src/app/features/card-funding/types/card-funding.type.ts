export enum CardTxnType {
  TOPUP = 'TOPUP',
  WITHDRAW = 'WITHDRAW',
}
export enum CardTxnStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface CardFundingTransactionItemResponse {
  id: number;

  card_id: string;

  type: CardTxnType;

  amount: string;

  status: CardTxnStatus;

  created_at: string;
}

export interface CardFundingTransactionPageResponse {
  items: CardFundingTransactionItemResponse[];

  page: number;

  size: number;

  total_size: number;

  has_next: boolean;
}
