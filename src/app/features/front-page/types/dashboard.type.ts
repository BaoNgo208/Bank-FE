import { DashboardPeriod } from '../../admin/dashboard/types/admin-dashboard.type';

export interface UserAssetAllocationResponse {
  total_amount: number;
  items: UserAssetAllocationItemResponse[];
}

export interface UserAssetAllocationItemResponse {
  key: string;
  amount: number;
  percent: number;
}

export interface UserCashFlowResponse {
  period: DashboardPeriod;
  items: UserCashFlowPointResponse[];
}

export interface UserCashFlowPointResponse {
  label: string;
  deposit_amount: string;
  withdraw_amount: string;
}
