import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BALANCE_HISTORY_SAMPLE } from '../../utils/sample.util';

@Component({
  selector: 'app-financial-records-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './financial-recoreds.component.html',
})
export class FinancialRecordsComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    rows: this.fb.array([]),
  });

  constructor() {
    this.initData();
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  private initData() {
    BALANCE_HISTORY_SAMPLE.forEach((item) => {
      this.rows.push(
        this.fb.group({
          serial: item.serial,
          user: item.user,
          scene: item.scene,
          changeAmount: item.changeAmount,
          balanceAfter: item.balanceAfter,
          serviceFee: item.serviceFee,
          state: item.state,
          description: item.description,
          time: item.time,
        }),
      );
    });
  }
}
