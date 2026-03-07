import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/side-bar/sidebar.component';
import { NavigationComponent } from '../../shared/components/nav/navigation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, NavigationComponent, CommonModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayout {
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
