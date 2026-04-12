import { inject, Injectable } from '@angular/core';
import { DepositAddressService } from '../services/deposit-address.service';
import { CreateDepositAddressRequest } from '../type/deposit-management.type';

@Injectable({
  providedIn: 'root',
})
export class DepositAdressFacade {
  private depositAdressService = inject(DepositAddressService);

  createDepositAddress(request: CreateDepositAddressRequest) {
    return this.depositAdressService.createDepositAddress(request);
  }
}
