import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { appTitle } from 'src/app/app.config';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-link-redirection',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `
    <div class="email-link-container">
      <h1>{{ appName }}</h1>
      <p *ngIf="!showMessageState">
        Le lien d'authentification vous a été envoyé à l'adresse
        <b>"{{ email }}"</b>, Cliquez sur le lien envoyé pour être authentifié
      </p>
      <p *ngIf="showMessageState">
        Veillez pantienter pendant que nous authentifions
        <b>"{{ email }}"</b>...
      </p>
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
  showMessageState!: boolean;
  email = localStorage.getItem('emailForSignIn');
  authStateSubscription?: Subscription;
  private router = inject(Router);
  private authService = inject(AuthService);
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  authState$ = this.authService.authState;

  ngOnInit(): void {
    this.showMessageState = this.router.url.includes('apiKey');
    this.authService.loginWithEmailLink();
    this.authStateSubscription = this.authState$.subscribe(
      async (user: User | null) => {
        if (user) {
          if (await this.fs.shopExists(user.uid)) {
            this.router.navigate(['/']);
          } else {
            await this.authService.logout();
            this.snackBar.open(
              'Aucun shop identifié à ce compte',
              'Créer un shop'
            );
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.authStateSubscription?.unsubscribe();
  }
}
