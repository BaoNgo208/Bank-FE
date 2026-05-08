import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import {
  AnnouncementResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '../../types/notification.type';

type AnnouncementModalMode = 'create' | 'update';

@Component({
  selector: 'app-announcement-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './announcement-form-modal.component.html',
})
export class AnnouncementFormModalComponent implements OnChanges {
  @Input() mode: AnnouncementModalMode = 'create';
  @Input() announcement: AnnouncementResponse | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<AnnouncementResponse>();

  private fb = inject(FormBuilder);
  private notiService = inject(NotificationService);

  submitting = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    content: ['', [Validators.required, Validators.maxLength(5000)]],
    link_url: ['', [Validators.maxLength(500)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['announcement']) {
      this.fillForm();
    }
  }

  get isUpdateMode() {
    return this.mode === 'update';
  }

  get titleText() {
    return this.isUpdateMode ? 'Update announcement' : 'Create announcement';
  }

  get descriptionText() {
    return this.isUpdateMode
      ? 'Edit selected system announcement.'
      : 'Add a new system announcement for users.';
  }

  get buttonText() {
    if (this.submitting()) {
      return this.isUpdateMode ? 'Updating...' : 'Creating...';
    }

    return this.isUpdateMode ? 'Update announcement' : 'Create announcement';
  }

  fillForm() {
    if (this.isUpdateMode && this.announcement) {
      this.form.patchValue({
        title: this.announcement.title,
        content: this.announcement.content,
        link_url: this.announcement.link_url ?? '',
      });
      return;
    }

    this.form.reset({
      title: '',
      content: '',
      link_url: '',
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.submitting.set(true);

    if (this.isUpdateMode) {
      if (!this.announcement) {
        this.submitting.set(false);
        return;
      }

      const payload: UpdateAnnouncementRequest = {
        title: raw.title!.trim(),
        content: raw.content!.trim(),
        link_url: raw.link_url?.trim() || null,
      };

      this.notiService
        .updateAnnouncement(this.announcement.id, payload)
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: (res) => {
            this.saved.emit(res.data);
            this.close.emit();
          },
        });

      return;
    }

    const payload: CreateAnnouncementRequest = {
      title: raw.title!.trim(),
      content: raw.content!.trim(),
      link_url: raw.link_url?.trim() || null,
    };

    this.notiService
      .createAnnouncement(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (res) => {
          this.saved.emit(res.data);
          this.close.emit();
        },
      });
  }

  onBackdropClick() {
    if (this.submitting()) return;
    this.close.emit();
  }
}
