import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardUserAgreementComponent } from '../../../features/card-user-agreement/card-user-agreement.component';
import { TermsModalComponent } from '../../../features/terms-modal/terms-modal.component';

export type TermType = 'privacy' | 'refund';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet, CommonModule, CardUserAgreementComponent, TermsModalComponent],
  templateUrl: './auth.page.html',
})
export class AuthPage {
  hoverSide: 'left' | 'right' | null = null;

  showAgreement = signal(false);

  showTerms = signal(false);
  activeTerm = signal<TermType>('privacy');

  openTerms(type: TermType) {
    this.activeTerm.set(type);
    this.showTerms.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeTerms() {
    this.showTerms.set(false);
    document.body.style.overflow = '';
  }

  handleAgreeTerm() {
    this.closeTerms();
  }

  openAgreement() {
    this.showAgreement.set(true);
  }

  closeAgreement() {
    this.showAgreement.set(false);
  }

  handleAgreeAgreement() {
    this.showAgreement.set(false);
  }
}
