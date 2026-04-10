import { CardStatus } from './wallet.type';

export interface CardDashboardResponse {
  total_balance: number;
  active_count: number;
  blocked_count: number;
}

export interface CardSearchParams {
  cardNumber?: string;
  cardName?: string;
  status?: CardStatus;
  fromTime?: string;
  toTime?: string;
  page?: number;
}
