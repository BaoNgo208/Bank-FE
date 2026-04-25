import {
  ChangeDetectorRef,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CashbackService } from './services/cashback.service';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  CashbackRuleResponse,
  CreateCashbackRuleRequest,
  UpdateCashbackRuleRequest,
} from './types/type';
import { CommonModule } from '@angular/common';
import { CashbackModalComponent } from './components/modals/cashback-modal.component';
import { CashbackStore } from './stores/cashback.store';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cashback-component',
  imports: [ReactiveFormsModule, CommonModule, CashbackModalComponent],
  templateUrl: './cashback.component.html',
})
export class CashbackComponent {
  private cashbackService = inject(CashbackService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  protected cashbackStore = inject(CashbackStore);

  selectedRule = signal<any | null>(null);

  isUpdate = computed(() => !!this.selectedRule());

  cashbackPage = 1;
  cashbackPageSize = 10;
  cashbackTotalItems = 0;

  form = this.fb.group({
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  openDropdownIndex: number | null = null;

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  onUpdate(index: number) {
    const row = this.rows.at(index).value;
    this.selectedRule.set(row);
    this.cashbackStore.isShowModal.set(true);
    this.cashbackStore.isShowModal.set(true);
    this.openDropdownIndex = null;
  }

  onCreate() {
    this.selectedRule.set(null);
    this.cashbackStore.isShowModal.set(true);
  }

  onDelete(index: number) {
    const row = this.rows.at(index).value;
    this.cashbackService.deleteCashbackRule(row.id).subscribe({
      next: () => {
        this.rows.removeAt(index);
        this.cd.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message,
        });
      },
    });
    this.openDropdownIndex = null;
  }

  handleSubmit(form: any) {
    const rule = this.selectedRule();

    const request$ = rule
      ? this.cashbackService.updateCashbackRule(rule.id, form)
      : this.cashbackService.createCashbackRule(form);

    request$
      .pipe(
        finalize(() => {
          this.cashbackStore.isShowModal.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          rule ? this.updateRow(rule.id, form) : this.addRow(res.data);
          this.cd.detectChanges();
        },
      });
  }

  addRow(newItem: any) {
    this.rows.push(
      this.fb.group({
        id: [newItem.id],
        min_spent: [newItem.min_spent],
        max_spent: [newItem.max_spent],
        cashback_percent: [newItem.cashback_percent],
        updated_at: [newItem.updated_at],
        is_active: [newItem.is_active],
      }),
    );
  }

  updateRow(id: number, updated: any) {
    const index = this.rows.controls.findIndex((ctrl) => ctrl.value.id === id);

    if (index !== -1) {
      this.rows.at(index).patchValue(updated);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    this.openDropdownIndex = null;
  }

  ngOnInit() {
    this.loadCashbackPage();
  }

  private loadCashbackPage() {
    this.cashbackService.getCashbackRules().subscribe({
      next: (res) => {
        const content = res.data;
        console.log(content);
        this.rows.clear();
        content.forEach((item: CashbackRuleResponse) =>
          this.rows.push(this.fb.group({ ...item, selected: [false] })),
        );
        this.cd.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message,
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
