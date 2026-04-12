import { inject, Injectable } from '@angular/core';
import { CreateDepositSettingsRequest } from '../type/deposit-management.type';
import { DepositSettingService } from '../services/deposit-setting.service';

@Injectable({
  providedIn: 'root',
})
export class DepositSettingFacade {
  private depositSettingService = inject(DepositSettingService);

  createDepositSetting(request: CreateDepositSettingsRequest) {
    return this.depositSettingService.createDepositSettings(request);
  }
}
