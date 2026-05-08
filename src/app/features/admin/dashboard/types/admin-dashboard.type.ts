export interface AdminDashboardSummaryResponse {
  total_users: number;
  pending_withdraw_count: number;
  pending_withdraw_amount: string;
  pending_deposit_count: number;
  pending_deposit_amount: string;
  total_wallet_balance: number;
}

export enum DashboardPeriod {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface CashFlowPointResponse {
  label: string;
  deposit_amount: string;
  withdraw_amount: string;
}

export interface AdminCashFlowResponse {
  period: DashboardPeriod;
  items: CashFlowPointResponse[];
}
