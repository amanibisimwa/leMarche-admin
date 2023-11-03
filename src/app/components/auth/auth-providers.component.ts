import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-provider',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  template: `
    <form [formGroup]="emailLinkForm">
      <mat-form-field appearance="outline" class="email-field">
        <mat-label>Email</mat-label>
        <input
          matInput
          placeholder="Ex: example@company.org"
          formControlName="email"
        />
        <mat-error
          *ngIf="
            !emailLinkForm.controls.email.hasError('required') &&
            emailLinkForm.controls.email.hasError('email')
          "
        >
          Email erroné
        </mat-error>
        <mat-error *ngIf="emailLinkForm.controls.email.hasError('required')">
          Entrez une adresse mail
        </mat-error>
      </mat-form-field>

      <button
        class="btn email-auth"
        mat-stroked-button
        (click)="onEmailLinkFormSubmit()"
        color="primary"
        [disabled]="emailLinkForm.invalid"
      >
        Connexion
      </button>

      <div class="divider">
        <mat-divider></mat-divider>
        <span>ou</span>
        <mat-divider></mat-divider>
      </div>

      <button
        class="btn google-auth"
        mat-fab
        extended
        color="primary"
        (click)="loginWithGoogle()"
      >
        <mat-icon>login</mat-icon>
        Connectez-vous avec Google
      </button>
    </form>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        margin: 0.1rem;
      }

      .btn {
        width: 100%;
        pointer-events: initial;
      }

      .divider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;

        mat-divider {
          width: 40%;
        }
      }
    `,
  ],
})
export class AuthProviderComponent {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  emailLinkForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  loginWithGoogle = () => this.authService.loginWithGoogle();

  onEmailLinkFormSubmit() {
    const email = this.emailLinkForm.value.email!;

    const actionCodeSettings = {
      url: `${location.origin}/email-link-redirection`,
      handleCodeInApp: true,
    };

    this.authService.sendAuthLink(email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    const notificationMsg = `Le lien d'authentification vous a été envoyé à l'adresse "${email}"`;
    this.snackBar.open(notificationMsg, 'OK');
    this.emailLinkForm.reset();
  }
}
