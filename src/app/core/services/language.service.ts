import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'zh' | 'ru' | 'uk';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly languages: LanguageOption[] = [
    {
      code: 'en',
      label: 'English',
      nativeLabel: 'English',
      flag: '🇬🇧',
    },
    {
      code: 'zh',
      label: 'Chinese',
      nativeLabel: '中文',
      flag: '🇨🇳',
    },
    {
      code: 'ru',
      label: 'Russian',
      nativeLabel: 'Русский',
      flag: '🇷🇺',
    },
    {
      code: 'uk',
      label: 'Ukrainian',
      nativeLabel: 'Українська',
      flag: '🇺🇦',
    },
  ];

  readonly currentLang = signal<AppLanguage>('en');

  init() {
    const savedLang = localStorage.getItem('app_language') as AppLanguage | null;

    const browserLang = this.translate.getBrowserLang() as AppLanguage | undefined;

    const defaultLang = this.isSupported(savedLang)
      ? savedLang
      : this.isSupported(browserLang)
        ? browserLang
        : 'en';

    this.translate.addLangs(this.languages.map((item) => item.code));
    this.translate.setFallbackLang('en');

    this.use(defaultLang);
  }

  use(lang: AppLanguage) {
    if (!this.isSupported(lang)) return;

    this.currentLang.set(lang);
    this.translate.use(lang);

    localStorage.setItem('app_language', lang);
    this.document.documentElement.lang = lang;
  }

  private isSupported(lang?: string | null): lang is AppLanguage {
    return !!lang && this.languages.some((item) => item.code === lang);
  }
}
