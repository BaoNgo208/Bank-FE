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
    top_up: '/home/wallet/top_up',
    financial_records: '/home/wallet/financial_records',
    card_grouping: '/home/card_management/card_grouping',
    appy_a_card: '/home/card_management/appy_a_card',
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
        { key: 'financial_records', label: 'Financial records' },
      ],
    },
    {
      key: 'card',
      label: 'Card Management',
      icon: 'fa-solid fa-id-card',
      children: [
        { key: 'appy_a_card', label: 'Apply for a card' },
        { key: 'card_management', label: 'Card management' },
        { key: 'card_grouping', label: 'Card grouping' },
        { key: 'transaction_records', label: 'Transaction records' },
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
