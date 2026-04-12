import { Stablecoin } from '../../../wallet/types/wallet.type';

export interface CreateDepositAddressRequest {
  currency: Stablecoin;
  network: string;
  address: string;
  display_order: number;
}

export interface DepositAddressResponse {
  id: number;
  currency: Stablecoin;
  network: string;
  address: string;
  display_order: number;
  status: string;
}

export interface CreateDepositSettingsRequest {
  currency: Stablecoin;
  fee_percent: number;
  min_amount: number;
  max_amount?: number;
}

export interface DepositSettingsResponse {
  id: number;
  currency: Stablecoin;
  fee_percent: number;
  min_amount: number;
  max_amount: number | null;
  status: string;
}
