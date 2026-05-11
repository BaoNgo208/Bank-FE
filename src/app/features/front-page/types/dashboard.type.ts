export interface UserAssetAllocationResponse {
  total_amount: number;
  items: UserAssetAllocationItemResponse[];
}

export interface UserAssetAllocationItemResponse {
  key: string;
  amount: number;
  percent: number;
}
