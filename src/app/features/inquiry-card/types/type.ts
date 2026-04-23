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
