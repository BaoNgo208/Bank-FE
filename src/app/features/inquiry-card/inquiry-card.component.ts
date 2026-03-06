import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CARD_INQUIRY_SAMPLE } from '../../utils/sample.util';

@Component({
  selector: 'app-inquiry-card-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-card.component.html',
})
export class InquiryCardComponent {
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
    CARD_INQUIRY_SAMPLE.forEach((item) => {
      this.rows.push(
        this.fb.group({
          selected: false,
          cardNumber: item.cardNumber,
          model: item.model,
          type: item.type,
          currency: item.currency,
          openTime: item.openTime,
          state: item.state,
          balance: item.balance,
          remark: item.remark,
        }),
      );
    });
  }
}
