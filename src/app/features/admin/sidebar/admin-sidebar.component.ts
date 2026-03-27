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
  menu = [
    { label: 'Dashboard', icon: 'fa-home', path: '/admin/dashboard' },
    { label: 'Users Management', icon: 'fa-users', path: '/admin/users' },
    { label: 'Withdrawals Management', icon: 'fa-arrow-up', path: '/admin/withdrawals' },
    { label: 'Deposits Management', icon: 'fa-arrow-down', path: '/admin/deposits' },
    { label: 'Transactions Management', icon: 'fa-exchange', path: '/admin/transactions' },
  ];
}
