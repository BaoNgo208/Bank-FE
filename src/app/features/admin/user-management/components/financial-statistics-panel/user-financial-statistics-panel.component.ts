import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { AdminUserFinancialStatisticsResponse, AdminUserResponse } from '../../types/type';

@Component({
  selector: 'app-user-financial-statistics-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-financial-statistics-panel.component.html',
})
export class UserFinancialStatisticsPanelComponent implements OnChanges {
  @Input({ required: true }) user!: AdminUserResponse;
  @Output() closed = new EventEmitter<void>();

  private usersService = inject(UsersService);

  statistics = signal<AdminUserFinancialStatisticsResponse | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user?.id) {
      this.loadStatistics();
    }
  }

  loadStatistics(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.statistics.set(null);

    this.usersService
      .getFinancialStatistics(this.user.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.statistics.set(response.data);
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Unable to load financial statistics. Please try again.',
          );
        },
      });
  }

  get avatarText(): string {
    return this.user?.username?.trim().charAt(0).toUpperCase() || 'U';
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.close();
  }
}
