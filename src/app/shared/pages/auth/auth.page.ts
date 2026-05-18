import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardUserAgreementComponent } from '../../../features/card-user-agreement/card-user-agreement.component';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet, CommonModule, CardUserAgreementComponent],
  templateUrl: './auth.page.html',
})
export class AuthPage {
  hoverSide: 'left' | 'right' | null = null;

  showAgreement = signal(false);

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
