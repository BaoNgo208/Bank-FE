export interface CardTransaction {
  serial: string;
  user: string;
  grouping: string;
  nickname: string;
  cardNumber: string;
  amount: number;
  status: 'Pending' | 'fail';
  time: string;
}

export interface CardGrouping {
  name: string;
  state: 'normal' | 'disabled';
  remark: string;
  date: string;
}

export interface BalanceHistory {
  serial: string;
  user: string;
  scene: string;
  changeAmount: number;
  balanceAfter: number;
  serviceFee: number;
  state: 'success' | 'fail' | 'pending';
  description: string;
  time: string;
}

export interface TransferRecord {
  transferOutAccount: string;
  transferToAccount: string;
  transferAmount: number;
  remark: string;
  creationTime: string;
}

export const CARD_TRANSACTION_SAMPLE: CardTransaction[] = [
  {
    serial: 'ed6e...4c',
    user: 'Ads Vietnam',
    grouping: 'Ads agency',
    nickname: 'HK-9FAA',
    cardNumber: '436790169614131',
    amount: 78,
    status: 'Pending',
    time: '2026-02-20 09:58:05',
  },
  {
    serial: '928c...15',
    user: 'Ads Vietnam',
    grouping: 'Ads agency',
    nickname: 'AAC 003-55',
    cardNumber: '436790167363707',
    amount: 868.47,
    status: 'fail',
    time: '2026-02-20 09:57:41',
  },
];

export const CARD_GROUPING_SAMPLE: CardGrouping[] = [
  {
    name: 'Ads Vietnam',
    state: 'normal',
    remark: '200.00',
    date: '3730.16',
  },
  {
    name: 'Ads Agency',
    state: 'disabled',
    remark: '150.00',
    date: '5120.22',
  },
];

export const BALANCE_HISTORY_SAMPLE: BalanceHistory[] = [
  {
    serial: '26022010530410079',
    user: 'Ads Vietnam',
    scene: 'Card top-up',
    changeAmount: 200,
    balanceAfter: 3730.16,
    serviceFee: 0,
    state: 'success',
    description: 'Card top-up (...)',
    time: '2026-02-20 10:50:34',
  },
  {
    serial: '26022010530410080',
    user: 'Ads Vietnam',
    scene: 'Withdraw',
    changeAmount: -100,
    balanceAfter: 3630.16,
    serviceFee: 2,
    state: 'fail',
    description: 'Withdraw failed',
    time: '2026-02-20 11:00:34',
  },
  {
    serial: '26022010530410080',
    user: 'Ads Vietnam',
    scene: 'Withdraw',
    changeAmount: -100,
    balanceAfter: 3630.16,
    serviceFee: 2,
    state: 'fail',
    description: 'Withdraw failed',
    time: '2026-02-20 11:00:34',
  },
  {
    serial: '26022010530410080',
    user: 'Ads Vietnam',
    scene: 'Withdraw',
    changeAmount: -100,
    balanceAfter: 3630.16,
    serviceFee: 2,
    state: 'fail',
    description: 'Withdraw failed',
    time: '2026-02-20 11:00:34',
  },
];

export const buildSampleRechargeRecords = [
  {
    orderNumber: '20260127214...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    orderNumber: '20260127213...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:30:46',
  },
  {
    orderNumber: '20251105185...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:55:34',
  },
  {
    orderNumber: '20251105184...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:41:46',
  },
  {
    orderNumber: '20251023171...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Partial',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:11:26',
  },
  {
    orderNumber: '20251023170...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 1000,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:09:17',
  },
  {
    orderNumber: '20260127214...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    orderNumber: '20260127213...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:30:46',
  },
  {
    orderNumber: '20251105185...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:55:34',
  },
  {
    orderNumber: '20251105184...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:41:46',
  },
  {
    orderNumber: '20251023171...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Partial',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:11:26',
  },
  {
    orderNumber: '20251023170...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 1000,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:09:17',
  },
  {
    orderNumber: '20260127214...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    orderNumber: '20260127213...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:30:46',
  },
  {
    orderNumber: '20251105185...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:55:34',
  },
  {
    orderNumber: '20251105184...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:41:46',
  },
  {
    orderNumber: '20251023171...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Partial',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:11:26',
  },
  {
    orderNumber: '20251023170...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 1000,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:09:17',
  },
  {
    orderNumber: '20260127214...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    orderNumber: '20260127213...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2026-01-27 20:30:46',
  },
  {
    orderNumber: '20251105185...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:55:34',
  },
  {
    orderNumber: '20251105184...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-11-05 17:41:46',
  },
  {
    orderNumber: '20251023171...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 100,
    state: 'Partial',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:11:26',
  },
  {
    orderNumber: '20251023170...',
    currency: 'Dollar',
    channel: 'USDT',
    amount: 1000,
    state: 'Pending',
    reason: '',
    remark: '',
    creationTime: '2025-10-23 16:09:17',
  },
];

export const buildSampleTransferRecords: TransferRecord[] = [
  {
    transferOutAccount: 'Main Wallet',
    transferToAccount: 'Trading Wallet',
    transferAmount: 200,
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    transferOutAccount: 'Funding Wallet',
    transferToAccount: 'Main Wallet',
    transferAmount: 100,
    remark: 'Internal transfer',
    creationTime: '2026-01-26 18:12:11',
  },
  {
    transferOutAccount: 'Trading Wallet',
    transferToAccount: 'Funding Wallet',
    transferAmount: 500,
    remark: '',
    creationTime: '2026-01-25 10:21:55',
  },
  {
    transferOutAccount: 'Main Wallet',
    transferToAccount: 'Trading Wallet',
    transferAmount: 200,
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    transferOutAccount: 'Funding Wallet',
    transferToAccount: 'Main Wallet',
    transferAmount: 100,
    remark: 'Internal transfer',
    creationTime: '2026-01-26 18:12:11',
  },
  {
    transferOutAccount: 'Trading Wallet',
    transferToAccount: 'Funding Wallet',
    transferAmount: 500,
    remark: '',
    creationTime: '2026-01-25 10:21:55',
  },
  {
    transferOutAccount: 'Main Wallet',
    transferToAccount: 'Trading Wallet',
    transferAmount: 200,
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    transferOutAccount: 'Funding Wallet',
    transferToAccount: 'Main Wallet',
    transferAmount: 100,
    remark: 'Internal transfer',
    creationTime: '2026-01-26 18:12:11',
  },
  {
    transferOutAccount: 'Trading Wallet',
    transferToAccount: 'Funding Wallet',
    transferAmount: 500,
    remark: '',
    creationTime: '2026-01-25 10:21:55',
  },
  {
    transferOutAccount: 'Main Wallet',
    transferToAccount: 'Trading Wallet',
    transferAmount: 200,
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    transferOutAccount: 'Funding Wallet',
    transferToAccount: 'Main Wallet',
    transferAmount: 100,
    remark: 'Internal transfer',
    creationTime: '2026-01-26 18:12:11',
  },
  {
    transferOutAccount: 'Trading Wallet',
    transferToAccount: 'Funding Wallet',
    transferAmount: 500,
    remark: '',
    creationTime: '2026-01-25 10:21:55',
  },
  {
    transferOutAccount: 'Main Wallet',
    transferToAccount: 'Trading Wallet',
    transferAmount: 200,
    remark: '',
    creationTime: '2026-01-27 20:44:43',
  },
  {
    transferOutAccount: 'Funding Wallet',
    transferToAccount: 'Main Wallet',
    transferAmount: 100,
    remark: 'Internal transfer',
    creationTime: '2026-01-26 18:12:11',
  },
  {
    transferOutAccount: 'Trading Wallet',
    transferToAccount: 'Funding Wallet',
    transferAmount: 500,
    remark: '',
    creationTime: '2026-01-25 10:21:55',
  },
];

export const CARD_INQUIRY_SAMPLE = [
  {
    cardNumber: '43612080',
    model: 'Visa',
    type: 'Virtual',
    currency: 'USD',
    openTime: '2025-03-06',
    state: 'Active',
    balance: 10,
    remark: 'Test',
  },
  {
    cardNumber: '43612079',
    model: 'Visa',
    type: 'Virtual',
    currency: 'USD',
    openTime: '2025-03-05',
    state: 'Frozen',
    balance: 5,
    remark: 'Demo',
  },
];

export const TRANSACTION_RECORDS_SAMPLE = [
  {
    cardNumber: '43612080',
    transactionType: 'Payment',
    merchantName: 'Amazon',
    currency: 'USD',
    amount: 120,
    received: 'Yes',
    status: 'Success',
    recordTime: '2025-03-06 10:20',
    remark: 'Online purchase',
  },
  {
    cardNumber: '43612079',
    transactionType: 'Refund',
    merchantName: 'Apple Store',
    currency: 'USD',
    amount: 80,
    received: 'No',
    status: 'Pending',
    recordTime: '2025-03-05 18:30',
    remark: 'Refund processing',
  },
  {
    cardNumber: '43612077',
    transactionType: 'Payment',
    merchantName: 'Netflix',
    currency: 'USD',
    amount: 15,
    received: 'Yes',
    status: 'Success',
    recordTime: '2025-03-04 21:00',
    remark: 'Subscription',
  },
];

export const WITHDRAWAL_SAMPLE = [
  {
    orderNumber: 'WD20250304001',
    channel: 'Bank transfer',
    amount: 500,
    exchangeRate: 1,
    state: 'Completed',
    reason: '-',
    remainingBalance: 1500,
    wallet: 'USDT Wallet',
    remark: 'Withdrawal to bank',
    submissionDate: '2025-03-04 10:20',
  },
  {
    orderNumber: 'WD20250304002',
    channel: 'Crypto',
    amount: 200,
    exchangeRate: 1,
    state: 'Pending',
    reason: '-',
    remainingBalance: 1300,
    wallet: 'BTC Wallet',
    remark: 'Processing',
    submissionDate: '2025-03-04 12:45',
  },
  {
    orderNumber: 'WD20250304003',
    channel: 'Bank transfer',
    amount: 100,
    exchangeRate: 1,
    state: 'Rejected',
    reason: 'Insufficient verification',
    remainingBalance: 1200,
    wallet: 'USD Wallet',
    remark: 'KYC required',
    submissionDate: '2025-03-04 14:30',
  },
];

export const INVITATION_COMMISSION_SAMPLE = [
  {
    inviteId: 'INV001',
    username: 'john_doe',
    totalCommission: 120,
  },
  {
    inviteId: 'INV002',
    username: 'alice_smith',
    totalCommission: 80,
  },
  {
    inviteId: 'INV003',
    username: 'michael_lee',
    totalCommission: 45,
  },
];

export type ChartRange = 'week' | 'month' | 'year';

export interface ChartData {
  labels: string[];
  deposit: number[];
  withdraw: number[];
}

export function getSampleChartData(range: ChartRange): ChartData {
  if (range === 'week') {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      deposit: [12000, 19000, 15000, 22000, 18000, 25000, 30000],
      withdraw: [8000, 14000, 12000, 17000, 15000, 20000, 24000],
    };
  }

  if (range === 'month') {
    return {
      labels: ['W1', 'W2', 'W3', 'W4'],
      deposit: [80000, 95000, 110000, 130000],
      withdraw: [60000, 70000, 85000, 100000],
    };
  }

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    deposit: [300000, 420000, 380000, 500000, 620000, 700000],
    withdraw: [250000, 300000, 280000, 400000, 500000, 580000],
  };
}

export function generateSampleRangeData(days: string[]): {
  deposit: number[];
  withdraw: number[];
} {
  return {
    deposit: days.map(() => Math.floor(Math.random() * 20000) + 10000),
    withdraw: days.map(() => Math.floor(Math.random() * 15000) + 8000),
  };
}

// ===== DASHBOARD STATS =====
export interface DashboardStat {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color: string;
}

export function getSampleStats(): DashboardStat[] {
  return [
    {
      label: 'Total Users',
      value: '11,259',
      icon: 'fa-users',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'New Withdrawals',
      value: '547',
      sub: '$1,252,000',
      icon: 'fa-money',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Completed Withdrawals',
      value: '501',
      sub: '$1,126,500',
      icon: 'fa-check',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Total Balance',
      value: '$21,589,230',
      icon: 'fa-wallet',
      color: 'bg-purple-100 text-purple-600',
    },
  ];
}

// ===== RECENT WITHDRAWALS =====
export interface RecentWithdrawal {
  id: string;
  user: string;
  amount: string;
  network: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  date: string;
}

export function getSampleRecentWithdrawals(): RecentWithdrawal[] {
  return [
    {
      id: 'WD123',
      user: 'user1@gmail.com',
      amount: '$600',
      network: 'TRC20',
      status: 'Pending',
      date: 'Apr 21',
    },
    {
      id: 'WD124',
      user: 'user2@gmail.com',
      amount: '$700',
      network: 'ERC20',
      status: 'Completed',
      date: 'Apr 21',
    },
    {
      id: 'WD125',
      user: 'user3@gmail.com',
      amount: '$500',
      network: 'BSC',
      status: 'Rejected',
      date: 'Apr 20',
    },
  ];
}
