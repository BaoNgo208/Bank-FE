import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { last } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  menu = [
    { label: 'Dashboard', icon: 'fa-home', path: '/admin/dashboard' },
    { label: 'Users Management', icon: 'fa-users', path: '/admin/users' },
    { label: 'Withdrawals Management', icon: 'fa-arrow-up', path: '/admin/withdrawals' },
    {
      label: 'Deposits Management',
      icon: 'fa-arrow-down',
      children: [
        { label: 'Deposit Address', path: '/admin/deposits/address' },
        { label: 'Deposit Setting', path: '/admin/deposits/settings' },
      ],
    },
    {
      label: 'Cashback',
      icon: 'fa-exchange',
      children: [
        {
          label: 'Cashback rules',
          path: '/admin/cashback/cashback-rules',
        },
        {
          label: 'Pending cashbacks',
          path: '/admin/cashback/pending-cashbacks',
        },
      ],
    },
    { label: 'Transactions Management', icon: 'fa-exchange', path: '/admin/transactions' },
  ];

  openMenu: string | null = null;

  toggle(label: string) {
    this.openMenu = this.openMenu === label ? null : label;
  }
}
