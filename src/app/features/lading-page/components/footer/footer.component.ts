import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CardUserAgreementComponent } from '../../../card-user-agreement/card-user-agreement.component';
import { TermsModalComponent } from '../../../terms-modal/terms-modal.component';
import { TermsStore } from '../../../../shared/stores/terms.store';
import { CommonModule } from '@angular/common';
import { LandingSection } from '../navbar/navbar.component';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, CardUserAgreementComponent, TermsModalComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  @Output() navClick = new EventEmitter<LandingSection>();

  protected termsStore = inject(TermsStore);

  goToSection(section: LandingSection) {
    this.navClick.emit(section);
  }
}
