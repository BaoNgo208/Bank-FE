import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SIDEBAR_ROUTE_MAP, SIDEBAR_TABS } from '../../../utils/sidebar.util';

@Component({
  selector: 'app-sidebar-component',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  @Output() closeSidebar = new EventEmitter<void>();

  tabs = SIDEBAR_TABS;
  activeTab = '';
  openMenus: string[] = [];

  private routeToKey: Record<string, string> = Object.fromEntries(
    Object.entries(SIDEBAR_ROUTE_MAP).map(([key, route]) => [route, key]),
  );

  ngOnInit() {
    this.syncFromUrl(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.syncFromUrl(e.urlAfterRedirects));
  }

  private syncFromUrl(url: string) {
    const path = url.split('?')[0];
    const key = this.routeToKey[path];
    if (key) {
      this.activeTab = key;
      this.autoOpenParent(key);
    }
  }

  private autoOpenParent(childKey: string) {
    for (const tab of this.tabs) {
      if (tab.children?.some((c: any) => c.key === childKey)) {
        if (!this.openMenus.includes(tab.key)) {
          this.openMenus.push(tab.key);
        }
        break;
      }
    }
  }

  toggleMenu(tab: any) {
    if (!tab.children) {
      this.navigate(tab.key);
      this.closeSidebar.emit();
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
    this.navigate(key);
    this.closeSidebar.emit();
  }

  isOpen(key: string) {
    return this.openMenus.includes(key);
  }

  isActive(tab: any) {
    if (tab.children) {
      return tab.children.some((c: any) => c.key === this.activeTab);
    }
    return this.activeTab === tab.key;
  }

  navigate(tabKey: string) {
    const route = SIDEBAR_ROUTE_MAP[tabKey];
    if (route) this.router.navigate([route]);
  }
}
