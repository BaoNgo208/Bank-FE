import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  menu = [
    { label: 'Dashboard', icon: 'fa-home', path: '/admin/dashboard' },
    { label: 'Users management', icon: 'fa-users', path: '/admin/users' },
    { label: 'Withdrawals orders', icon: 'fas fa-money-bill-transfer', path: '/admin/withdrawals' },
    { label: 'Deposits orders', icon: 'fas fa-money-bill-transfer', path: '/admin/deposits' },
    {
      label: 'Deposit configurations',
      icon: 'fa fa-cog',
      children: [
        { label: 'Deposit address', path: '/admin/deposits/address' },
        { label: 'Deposit setting', path: '/admin/deposits/settings' },
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
    { label: 'Card Management', icon: 'fa-credit-card', path: '/admin/card' },
  ];

  openMenu: string | null = null;

  toggle(label: string) {
    this.openMenu = this.openMenu === label ? null : label;
  }
}
