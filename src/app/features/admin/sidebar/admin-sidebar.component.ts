import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  constructor(private router: Router) {}

  menu = [
    { label: 'Dashboard', icon: 'fa-home', path: '/admin/dashboard' },
    { label: 'Users', icon: 'fa-users', path: '/admin/users' },
    { label: 'Withdrawals', icon: 'fa-money', path: '/admin/withdrawals' },
    { label: 'Transactions', icon: 'fa-exchange', path: '/admin/transactions' },
  ];
}
