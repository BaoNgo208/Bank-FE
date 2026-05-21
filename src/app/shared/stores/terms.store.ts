import { Injectable, signal } from '@angular/core';
import { TermType } from '../pages/auth/auth.page';

@Injectable({
  providedIn: 'root',
})
export class TermsStore {
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
