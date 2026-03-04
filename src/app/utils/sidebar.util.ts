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

  // User
  user_list: '/home/user/user_list',
  roles: '/home/user/roles',
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
    key: 'card',
    label: 'Card Management',
    icon: 'fa-solid fa-id-card',
    children: [{ key: 'card_grouping', label: 'Card grouping' }],
  },
  {
    key: 'apply_card',
    label: 'Apply for a card',
    icon: 'fa-solid fa-id-card',
  },
  {
    key: 'transaction_records',
    label: 'Transaction records',
    icon: 'fa-solid fa-arrow-right-arrow-left',
  },
  {
    key: 'user',
    label: 'User Management',
    icon: 'fa-solid fa-user',
    children: [
      { key: 'user_list', label: 'All users' },
      { key: 'roles', label: 'Roles' },
    ],
  },
];
