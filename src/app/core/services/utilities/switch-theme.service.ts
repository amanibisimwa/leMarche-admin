import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SwitchThemeService {
  theme = signal('dark-theme');

  switchTheme(theme: string): void {
    if (theme === 'device-theme') {
      this.theme.set(theme);
    } else if (theme === 'light-theme') {
      this.theme.set(theme);
    } else {
      this.theme.set(theme);
    }
  }
}
