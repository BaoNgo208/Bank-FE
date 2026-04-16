import { Stablecoin, WithdrawOrderStatus } from '../../../wallet/types/wallet.type';

export interface WithdrawOrderPageResponse {
  items: WithdrawOrderListResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface WithdrawOrderListResponse {
  order_no: string;
  currency: Stablecoin;
  network: string;
  to_address: string;
  amount: number;
  status: WithdrawOrderStatus;
  created_at: string;
  admin_note: string;
}

export interface UpdateWithdrawStatusRequest {
  status: WithdrawOrderStatus;
  admin_note: string;
}
