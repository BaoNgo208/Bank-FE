import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../features/admin/sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../../features/admin/header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayout {}
