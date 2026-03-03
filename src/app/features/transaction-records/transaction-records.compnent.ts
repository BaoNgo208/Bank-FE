import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CARD_TRANSACTION_SAMPLE } from '../../utils/sample.util';

@Component({
  selector: 'app-transaction-records-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './transaction-records.component.html',
})
export class TransactionRecordsComponent {
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

  private initData() {
    CARD_TRANSACTION_SAMPLE.forEach((item) => {
      this.rows.push(
        this.fb.group({
          selected: false,
          serial: item.serial,
          user: item.user,
          grouping: item.grouping,
          nickname: item.nickname,
          cardNumber: item.cardNumber,
          amount: item.amount,
          status: item.status,
          time: item.time,
        }),
      );
    });
  }

  toggleAll() {
    const checked = this.form.get('checkAll')?.value;
    this.rows.controls.forEach((control) => {
      control.get('selected')?.setValue(checked, { emitEvent: false });
    });
  }

  toggleOne() {
    const allChecked = this.rows.controls.every(
      (control) => control.get('selected')?.value === true,
    );

    this.form.get('checkAll')?.setValue(allChecked, { emitEvent: false });
  }

  getSelectedRows() {
    return this.rows.value.filter((row: any) => row.selected);
  }
}
