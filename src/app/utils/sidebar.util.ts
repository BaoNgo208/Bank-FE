export interface SidebarChild {
  key: string;
  label: string;
}

export interface SidebarTab {
  key: string;
  label: string;
  icon?: string;
  children?: SidebarChild[];
}

/**
 * Route mapping
 */
export const SIDEBAR_ROUTE_MAP: Record<string, string> = {
  front: '/home/front-page',

  // Wallet
  wallet: '/home/wallet',
  top_up: '/home/wallet/top_up',
  financial_records: '/home/wallet/financial_records',

  apply_card: '/home/apply_card',
  transaction_records: '/home/transaction_records',
  // Card
  card_grouping: '/home/card_management/card_grouping',

  cashback: '/home/cashback',

  inquiry_card: '/home/inquiry_card',

  wallet_transactions: '/home/wallet_transactions',
  deposit: '/home/wallet_transactions/deposit',
  withdrawal: '/home/wallet_transactions/withdrawal',
  invitation_commission: '/home/invitation_commission',
};

/**
 * Sidebar config
 */
export const SIDEBAR_TABS: SidebarTab[] = [
  { key: 'front', label: 'Front page', icon: 'fa-regular fa-star' },

  {
    key: 'wallet',
    label: 'Wallet',
    icon: 'fa-solid fa-lock',
    // children: [
    //   { key: 'top_up', label: 'Top up' },
    //   { key: 'financial_records', label: 'Financial records' },
    // ],
  },

  {
    key: 'apply_card',
    label: 'Apply for a card',
    icon: 'fa-solid fa-id-card',
  },
  {
    key: 'inquiry_card',
    label: 'Inquiry card',
    icon: 'fa-solid fa-magnifying-glass',
  },

  {
    key: 'cashback',
    label: 'Cashback',
    icon: 'fa-solid fa-money-bill-transfer',
  },
  {
    key: 'wallet_transactions',
    label: 'Wallet Transactions',
    icon: 'fa-solid fa-money-bill-transfer',
    children: [
      { key: 'deposit', label: 'Deposit' },
      { key: 'withdrawal', label: 'Withdrawal' },
    ],
  },
  {
    key: 'transaction_records',
    label: 'Transaction records',
    icon: 'fa-solid fa-arrow-right-arrow-left',
  },

  {
    key: 'invitation_commission',
    label: 'Invitation commission',
    icon: 'fa-solid fa-user-plus',
  },
];
