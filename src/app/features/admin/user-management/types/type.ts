export interface AdminUserPageResponse {
  items: AdminUserResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface AdminUserResponse {
  id: number;
  username: string;
  email: string;
  status: AccountStatus;
  card_open_limit: number;
  updated_at: string;
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  DELETED = 'DELETED',
}

export interface UpdateCardOpenLimitRequest {
  card_open_limit: number;
}

export interface AdminFinancialStatistics {
  success_count: number;
  success_amount: number;
  pending_count: number;
  pending_amount: number;
  failed_count: number;
  failed_amount: number;
  success_rate: number;
}

export type AdminDepositStatisticsResponse = AdminFinancialStatistics;

export type AdminWithdrawStatisticsResponse = AdminFinancialStatistics;

export interface AdminCardTransactionStatisticsResponse extends AdminFinancialStatistics {
  posted_count: number;
  posted_amount: number;
  reversed_count: number;
  reversed_amount: number;
  refund_rate: number;
}

export interface AdminUserFinancialStatisticsResponse {
  deposit: AdminDepositStatisticsResponse;
  withdraw: AdminWithdrawStatisticsResponse;
  card_transaction: AdminCardTransactionStatisticsResponse;
}
