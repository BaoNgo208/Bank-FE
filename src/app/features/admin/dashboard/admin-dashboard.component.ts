import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  stats = [
    { label: 'Total Users', value: '11,259', icon: 'fa-users', color: 'bg-blue-100 text-blue-600' },
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

  recentWithdrawals = [
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
