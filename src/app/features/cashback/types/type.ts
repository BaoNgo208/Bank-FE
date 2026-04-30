export interface CashbackDashboardResponse {
  total_spent: number;
  cashback_amount: number;
  current_percent: number;
  tiers: CashbackTierResponse[];
}

export interface CashbackTierResponse {
  min_spent: number;
  max_spent: number;
  percent: number;
  is_current: boolean;
}

export enum CashbackStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CashbackHistoryResponse {
  user_id: number;

  month: string;

  total_spent: string; // BigDecimal → string (tránh mất precision)
  cashback_amount: string;

  percent: string;

  cashback_status: CashbackStatus;

  approved_at?: string | null;
}

export interface CashbackHistoryPageResponse {
  items: CashbackHistoryResponse[];

  page: number;
  size: number;

  total_size: number;
  has_next: boolean;

  updated_at: string;
}
