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
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
    <button
      class="google-auth-btn"
      mat-fab
      extended
      color="primary"
      (click)="loginWithGoogle()"
    >
      <mat-icon>login</mat-icon>
      Connectez-vous avec Google
    </button>

    <div class="divider">
      <mat-divider></mat-divider>
      <span>ou</span>
      <mat-divider></mat-divider>
    </div>

    <form [formGroup]="emailLinkForm" align="end">
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
        class="email-auth-btn"
        mat-stroked-button
        (click)="onEmailLinkFormSubmit()"
        color="primary"
        [disabled]="emailLinkForm.invalid"
      >
        Connexion
      </button>
    </form>
  `,
  styles: [
    `
      .google-auth-btn {
        width: 100%;
        box-shadow: none;
      }

      form {
        border: 1px solid gray;
        border-radius: 8px;
        padding: 1rem;
      }

      mat-form-field {
        width: 100%;
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
  private router = inject(Router);

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
    this.router.navigate(['email-link-redirection']);
  }
}
