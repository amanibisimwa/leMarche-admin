import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { appTitle } from 'src/app/app.config';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { AuthProviderComponent } from './auth-provider.component';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ appName }}</mat-card-title>
        <mat-card-subtitle
          >Connectez-vous et gérez votre shop en un clic <br />
          Besoin d'un nouveau shop ?
          <a mat-button color="primary" routerLink="/register-shop"
            >Créez-vous en un ici</a
          >
        </mat-card-subtitle>
      </mat-card-header>
      <mat-divider></mat-divider>
      <mat-card-content>
        <app-auth-provider />
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: max-content;
        margin: 2rem auto;
      }

      .mat-divider {
        margin: 1rem 0;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterLink,
    AuthProviderComponent,
  ],
})
export default class LoginComponent {
  hide = true;
  appName = appTitle;
  authStateSubscription!: Subscription;
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private fs = inject(FirestoreService);
  private authService = inject(AuthService);
  authState$ = this.authService.authState;

  ngOnInit(): void {
    this.authStateSubscription = this.authState$.subscribe(
      async (user: User | null) => {
        if (user) {
          if (await this.fs.shopExists(user.uid)) {
            this.router.navigate(['/dashboard']);
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
