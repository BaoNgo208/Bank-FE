import { Stablecoin } from '../../../wallet/types/wallet.type';

export interface WalletCurrencySettingsResponse {
  id: number;
  currency: Stablecoin;

  deposit_fee_percent: string;
  min_deposit_amount: string;
  min_withdraw_amount: string;
  min_card_funding_amount: string;

  status: string;
}

export interface UpdateWalletCurrencySettingsRequest {
  currency: Stablecoin;

  deposit_fee_percent: string;
  min_deposit_amount: string;
  min_withdraw_amount: string;
  min_card_funding_amount: string;
}
