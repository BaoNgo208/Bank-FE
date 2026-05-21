import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardUserAgreementComponent } from '../../../features/card-user-agreement/card-user-agreement.component';
import { TermsModalComponent } from '../../../features/terms-modal/terms-modal.component';
import { TermsStore } from '../../stores/terms.store';

export type TermType = 'privacy' | 'refund';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet, CommonModule, CardUserAgreementComponent, TermsModalComponent],
  templateUrl: './auth.page.html',
})
export class AuthPage {
  hoverSide: 'left' | 'right' | null = null;

  protected termsStore = inject(TermsStore);
}
