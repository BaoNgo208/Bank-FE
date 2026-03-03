import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SIDEBAR_ROUTE_MAP, SIDEBAR_TABS } from '../../../utils/sidebar.util';

@Component({
  selector: 'app-sidebar-component',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private router = inject(Router);

  tabs = SIDEBAR_TABS;
  activeTab = 'front';
  openMenus: string[] = [];

  selectTab(key: string) {
    this.activeTab = key;
  }

  toggleMenu(tab: any) {
    if (!tab.children) {
      this.activeTab = tab.key;
      return;
    }

    if (this.openMenus.includes(tab.key)) {
      this.openMenus = this.openMenus.filter((k) => k !== tab.key);
    } else {
      this.openMenus.push(tab.key);
    }
  }

  selectChild(key: string, event: Event) {
    event.stopPropagation();
    this.activeTab = key;
  }

  isOpen(key: string) {
    return this.openMenus.includes(key);
  }

  isActive(tab: any) {
    if (tab.children) {
      return tab.children.some((c: any) => c.key === this.activeTab);
    }
    this.navigate(this.activeTab);
    return this.activeTab === tab.key;
  }

  navigate(tabKey: string) {
    console.log(tabKey);
    const route = SIDEBAR_ROUTE_MAP[tabKey];
    if (route) {
      this.router.navigate([route]);
    }
  }
}
