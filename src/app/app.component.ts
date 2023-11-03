import { ApplicationRef, Component, Inject, effect } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { SwitchThemeService } from './core/services/utilities/switch-theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: ` <router-outlet></router-outlet> `,
  styles: [],
})
export class AppComponent {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sts: SwitchThemeService,
    private ref: ApplicationRef
  ) {
    const themeInStorage = localStorage.getItem('theme');

    if (!themeInStorage) {
      this.sts.theme.set('device-theme');
    } else {
      this.sts.theme.set(themeInStorage);
    }

    effect(() => {
      const theme = this.sts.theme();
      if (theme === 'device-theme' || !theme) {
        const isLightOn = matchMedia('(prefers-color-scheme: light)').matches;
        this.setDeviceTheme(isLightOn);

        // Surveillez les changements de préférence
        matchMedia('(prefers-color-scheme: light)').addEventListener(
          'change',
          (e) => {
            this.setDeviceTheme(e.matches);

            // Déclenche l'actualisation de l'interface utilisateur
            this.ref.tick();
          }
        );
      } else if (theme == 'light-theme') {
        this.document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
      } else {
        this.document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark-theme');
      }
    });
  }

  setDeviceTheme(isLightOn: boolean) {
    if (isLightOn) {
      this.document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light-theme');
    } else {
      this.document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark-theme');
    }
  }
}
