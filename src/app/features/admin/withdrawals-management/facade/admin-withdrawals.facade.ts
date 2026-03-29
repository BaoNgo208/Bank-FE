import { inject, Injectable } from '@angular/core';
import { AdminWithdrawalsService } from '../service/admin-widthdrawals.service';
import { WithdrawalsStore } from '../store/widthdrawls.store';
import { UpdateWithdrawStatusRequest } from '../model/widthdrawl.model';

@Injectable({
  providedIn: 'root',
})
export class AdminWithdrawalsFacade {
  private adminWithdrawalsService = inject(AdminWithdrawalsService);
  private widthdrawalsStore = inject(WithdrawalsStore);

  getAllWithdrawOrders(page: number = 0) {
    return this.adminWithdrawalsService.getAllWithdrawOrders(page);
  }

  updateWithdrawStatus(order_no: string, request: UpdateWithdrawStatusRequest) {
    return this.adminWithdrawalsService.updateWithdrawStatus(order_no, request);
  }
}
