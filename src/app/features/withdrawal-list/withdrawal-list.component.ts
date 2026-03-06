import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TRANSACTION_RECORDS_SAMPLE, WITHDRAWAL_SAMPLE } from '../../utils/sample.util';

@Component({
  selector: 'app-widthdrawal-list-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdrawal-list.component.html',
})
export class WidthdrawalListComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    checkAll: [false],
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  constructor() {
    this.initData();
  }

  toggleAll() {
    const checked = this.form.value.checkAll;

    this.rows.controls.forEach((row) => {
      row.get('selected')?.setValue(checked);
    });
  }

  private initData() {
    WITHDRAWAL_SAMPLE.forEach((item) => {
      this.rows.push(
        this.fb.group({
          orderNumber: item.orderNumber,
          channel: item.channel,
          amount: item.amount,
          exchangeRate: item.exchangeRate,
          state: item.state,
          reason: item.reason,
          remainingBalance: item.remainingBalance,
          wallet: item.wallet,
          remark: item.remark,
          submissionDate: item.submissionDate,
        }),
      );
    });
  }
}
