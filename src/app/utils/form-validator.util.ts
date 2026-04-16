import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const from = group.get('fromTime')?.value;
  const to = group.get('toTime')?.value;

  if (!from || !to) return null;

  return new Date(from) > new Date(to) ? { invalidDateRange: true } : null;
};
