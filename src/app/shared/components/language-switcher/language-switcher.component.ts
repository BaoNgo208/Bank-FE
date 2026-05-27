import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppLanguage, LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);

  changeLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as AppLanguage;
    this.languageService.use(lang);
  }
}
