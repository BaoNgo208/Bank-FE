import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CARD_GROUPING_SAMPLE } from '../../utils/sample.util';

@Component({
  selector: 'app-card-grouping-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './card-grouping.component.html',
})
export class CardGroupingComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      checkAll: [false],
      rows: this.fb.array([]),
    });

    this.initData();
  }

  // Fake data (sau này replace bằng API)
  private initData() {
    CARD_GROUPING_SAMPLE.forEach((item) => {
      this.rows.push(
        this.fb.group({
          selected: [false],
          name: [item.name],
          state: [item.state],
          remark: [item.remark],
          date: [item.date],
        }),
      );
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  // Toggle header checkbox
  toggleAll() {
    const checked = this.form.get('checkAll')?.value;
    this.rows.controls.forEach((control) => {
      control.get('selected')?.setValue(checked, { emitEvent: false });
    });
  }

  // Toggle individual checkbox
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
