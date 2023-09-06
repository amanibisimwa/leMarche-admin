import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { appTitle } from 'src/app/app.config';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';

@Component({
  selector: 'app-email-link-redirection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-link-container">
      <h1>{{ appName }}</h1>
      <p>Veuillez pantienter pendant qu'on identifie "{{ email }}"...</p>
    </div>
  `,
  styles: [
    `
      .email-link-container {
        width: clamp(60%, 5vw, 80%);
        margin: 2rem auto;
        text-align: center;
      }
    `,
  ],
})
export default class EmailLinkRedirectionComponent {
  appName = appTitle;
  email = localStorage.getItem('emailForSignIn');
  authStateSubscription?: Subscription;
  private router = inject(Router);
  private authService = inject(AuthService);
  private fs = inject(FirestoreService);
  authState$ = this.authService.authState;

  ngOnInit(): void {
    this.authService.loginWithEmailLink();
    this.authStateSubscription = this.authState$.subscribe(
      async (user: User | null) => {
        if (user) {
        }
      }
    );
  }

  ngOnDestroy() {
    this.authStateSubscription?.unsubscribe();
  }
}
