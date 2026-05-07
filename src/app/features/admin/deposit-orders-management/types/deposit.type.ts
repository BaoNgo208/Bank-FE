import { Stablecoin } from '../../../wallet/types/wallet.type';

export interface DepositOrderPageAdminResponse {
  items: DepositOrderListAdminResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface DepositOrderListAdminResponse {
  order_no: string;
  user_id: number;
  currency: Stablecoin;
  network: string;
  amount: number;
  fee: number;
  expected_amount: number;
  deposit_address: string;
  status: DepositOrderStatus;
  admin_note: string | null;
  image_urls: string;
  updated_at: string;
}

export interface UpdateDepositStatusRequest {
  status: DepositOrderStatus;
  admin_note?: string | null;
}

export enum DepositOrderStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}
