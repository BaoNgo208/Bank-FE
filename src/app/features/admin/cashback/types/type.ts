export interface CashbackRuleResponse {
  id: number;
  min_spent: number;
  max_spent: number;
  cashback_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCashbackRuleRequest {
  min_spent: number;
  max_spent?: number;
  cashback_percent: number;
}

export interface UpdateCashbackRuleRequest {
  min_spent?: number;
  max_spent?: number;
  cashback_percent?: number;
}

export interface CashbackRuleForm {
  min_spent: number | null;
  max_spent: number | null;
  cashback_percent: number | null;
}
