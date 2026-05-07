import { CardBrand, CardStatus } from '../../../wallet/types/wallet.type';

export interface AdminCardPageResponse {
  items: AdminCardListResponse[];
  page: number;
  size: number;
  total_size: number;
  has_next: boolean;
}

export interface AdminCardListResponse {
  id: number;
  user_id: number;
  username: string;
  masked_card: string;
  brand: CardBrand;
  name: string;
  note: string | null;
  currency: string;
  status: CardStatus;
  remaining_amount: number | string;
  created_at: string;
}
