import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-component',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private router = inject(Router);
  private routeMap: Record<string, string> = {
    front: '/home/front-page',
    top_up: '/home/wallet',
    card: '/home/card',
    user: '/home/user',
  };

  tabs = [
    { key: 'front', label: 'Front page', icon: 'fa-regular fa-star' },
    {
      key: 'wallet',
      label: 'Wallet',
      icon: 'fa-solid fa-lock',
      children: [
        { key: 'top_up', label: 'Top up' },
        { key: 'financial-records', label: 'Financial records' },
      ],
    },
    {
      key: 'card',
      label: 'Card Management',
      icon: 'fa-solid fa-id-card',
      children: [
        { key: 'card_list', label: 'All cards' },
        { key: 'card_create', label: 'Create card' },
        { key: 'card_trans', label: 'Transactions' },
      ],
    },
    {
      key: 'user',
      label: 'User Management',
      icon: 'fa-solid fa-user',
      children: [
        { key: 'user_list', label: 'All users' },
        { key: 'roles', label: 'Roles' },
      ],
    },
  ];

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
    event.stopPropagation(); // không trigger parent
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
    const route = this.routeMap[tabKey];
    if (route) {
      this.router.navigate([route]);
    }
  }
}
