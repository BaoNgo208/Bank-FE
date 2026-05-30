import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppLanguage, LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);

  changeLanguage(lang: AppLanguage) {
    this.languageService.use(lang);
  }
}
