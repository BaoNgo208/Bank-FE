import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { INVITATION_COMMISSION_SAMPLE, TRANSACTION_RECORDS_SAMPLE } from '../../utils/sample.util';

@Component({
  selector: 'app-invitation-commission-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invitation-commission.component.html',
})
export class InvitationCommissionComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    checkAll: [false],
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  constructor() {
    // this.initData();
  }

  private initData() {
    INVITATION_COMMISSION_SAMPLE.forEach((item: any) => {
      this.rows.push(
        this.fb.group({
          inviteId: item.inviteId,
          username: item.username,
          totalCommission: item.totalCommission,
        }),
      );
    });
  }
}
