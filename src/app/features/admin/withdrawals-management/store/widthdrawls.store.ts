import { Injectable, signal } from '@angular/core';
import { WithdrawOrderStatus } from '../../../wallet/types/wallet.type';

@Injectable({ providedIn: 'root' })
export class WithdrawalsStore {
  // state
  private _items = signal<any[]>([]);
  private _total = signal(0);

  // expose readonly
  items = this._items.asReadonly();
  total = this._total.asReadonly();

  // ===== SET =====
  setWithdrawals(items: any[], total: number) {
    this._items.set(items);
    this._total.set(total);
  }

  // ===== APPEND ===== (pagination load more)
  appendWithdrawals(items: any[]) {
    this._items.update((prev) => [...prev, ...items]);
  }

  // ===== UPDATE 1 ROW =====
  updateStatus(orderNo: string, status: WithdrawOrderStatus) {
    this._items.update((items) =>
      items.map((item) => (item.order_no === orderNo ? { ...item, status } : item)),
    );
  }

  // ===== RESET =====
  clear() {
    this._items.set([]);
    this._total.set(0);
  }
}
