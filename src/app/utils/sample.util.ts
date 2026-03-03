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
