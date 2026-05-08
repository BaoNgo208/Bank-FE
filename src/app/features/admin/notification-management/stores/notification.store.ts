import { Injectable, signal } from '@angular/core';
import { AnnouncementResponse } from '../types/notification.type';

@Injectable({
  providedIn: 'root',
})
export class NotificationStore {
  public notifications = signal<AnnouncementResponse[]>([]);

  setNotifications(items: AnnouncementResponse[]) {
    this.notifications.set(items);
  }

  appendNotification(item: AnnouncementResponse) {
    this.notifications.update((items) => [item, ...items]);
  }

  appendNotifications(newItems: AnnouncementResponse[]) {
    this.notifications.update((items) => [...items, ...newItems]);
  }

  patchNotification(id: number, patch: Partial<AnnouncementResponse>) {
    this.notifications.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  removeNotification(id: number) {
    this.notifications.update((items) => items.filter((item) => item.id !== id));
  }

  clearNotifications() {
    this.notifications.set([]);
  }
}
