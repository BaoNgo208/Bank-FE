import { CashbackStatus } from '../../../cashback/types/type';

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

export interface CashbackRefundResponse {
  user_id: number;
  display_name: string;
  email: string;
  total_spent: string;
  cashback_amount: string;
  percent: string;
  month: string;
  status: CashbackStatus;
  updated_at: string;
}

export interface CashbackRefundPageResponse {
  items: CashbackRefundResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface ApproveCashbackBatchRequest {
  user_ids: number[];
}
