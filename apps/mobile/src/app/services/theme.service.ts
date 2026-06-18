import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'theme_preference';
  private readonly darkClass = 'ion-palette-dark';

  initializeTheme(): void {
    const stored = localStorage.getItem(this.storageKey);

    if (stored === 'dark') {
      this.applyDarkClass(true);
      return;
    }

    if (stored === 'light') {
      this.applyDarkClass(false);
      return;
    }

    this.applyDarkClass(this.prefersDarkFromSystem());
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains(this.darkClass);
  }

  setDarkMode(enabled: boolean): void {
    this.applyDarkClass(enabled);
    localStorage.setItem(this.storageKey, enabled ? 'dark' : 'light');
  }

  private applyDarkClass(enabled: boolean): void {
    document.documentElement.classList.toggle(this.darkClass, enabled);
  }

  private prefersDarkFromSystem(): boolean {
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  }
}
