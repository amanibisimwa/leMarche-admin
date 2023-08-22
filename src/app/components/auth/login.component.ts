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
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShopRegisterComponent } from './shop-register.component';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { FormFieldValidatorService } from 'src/app/core/services/firebase/form-field-validator.service';
import { shopCol } from 'src/app/core/services/firebase/_firestore.collection';
import { appTitle } from 'src/app/app.config';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShopService } from 'src/app/core/services/firebase/shop.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ appName }}</mat-card-title>
        <mat-card-subtitle>Gérer votre shop en un clic</mat-card-subtitle>
      </mat-card-header>
      <mat-divider class="divider-header">></mat-divider>
      <mat-card-content class="login-container">
        <mat-stepper linear #stepper>
          <mat-step
            [completed]="checkIdForm.valid"
            label="Idéntifiez votre shop"
          >
            <form [formGroup]="checkIdForm" errorMessage="Iditifiant erroné">
              <mat-form-field appearance="outline">
                <mat-label>Identifiant</mat-label>
                <input
                  matInput
                  placeholder="Ex: Tacite Shop"
                  formControlName="checkField"
                />
                <mat-spinner
                  matSuffix
                  strokeWidth="2"
                  diameter="20"
                  *ngIf="checkField?.pending"
                ></mat-spinner>
                <mat-error
                  *ngIf="
            checkField?.errors?.['notFound'] &&
          !checkField?.errors?.['required']
        "
                >
                  Code erroné !, ce shop n'existe pas.
                </mat-error>
                <mat-error *ngIf="checkField?.errors?.['required']"
                  >le code est obligatoire</mat-error
                >
              </mat-form-field>
              <div class="next-btn" align="end">
                <button
                  mat-flat-button
                  matStepperNext
                  color="primary"
                  [disabled]="checkIdForm.invalid || checkField?.pending"
                >
                  Suivant
                </button>
              </div>
              <mat-divider></mat-divider>
              <div class="actions">
                <span>Besoin d'un shop ? </span>
                <button
                  mat-stroked-button
                  color="primary"
                  (click)="newShopDialog()"
                >
                  Créez-en un
                </button>
              </div>
            </form>
          </mat-step>
          <mat-step label="Connectez-vous">
            <form [formGroup]="EmailLinkForm">
              <mat-form-field appearance="outline" class="email-field">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  placeholder="Ex: example@company.org"
                  formControlName="email"
                />
                <mat-error
                  *ngIf="!email?.errors?.['required'] && email?.errors?.['email']"
                >
                  Email erroné
                </mat-error>
                <mat-error *ngIf="email?.errors?.['required']">
                  Entrez une adresse mail
                </mat-error>
              </mat-form-field>

              <button
                class="btn email-auth"
                mat-stroked-button
                (click)="onEmailLinkFormSubmit()"
                color="primary"
                [disabled]="EmailLinkForm.invalid"
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
                mat-flat-button
                color="primary"
                (click)="loginWithGoogle()"
              >
                Connectez-vous avec Google
              </button>
            </form>
          </mat-step>
        </mat-stepper>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: max-content;
        margin: 1rem auto;
      }

      mat-form-field {
        width: 100%;
        margin: 0.1rem;
      }

      .next-btn {
        margin-bottom: 1rem;
      }

      .actions {
        display: flex;
        margin-top: 1rem;
        justify-content: space-between;
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

      .divider-header {
        margin-top: 1rem;
      }

      .btn {
        width: 100%;
      }

      mat-spinner {
        margin-right: 1rem;
      }
    `,
  ],
})
export default class LoginComponent {
  appName = appTitle;
  private ffvs = inject(FormFieldValidatorService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  authStateSubscription?: Subscription;
  private authService = inject(AuthService);
  authState$ = this.authService.authState;

  ngOnInit(): void {
    this.authStateSubscription = this.authState$.subscribe(
      (user: User | null) => {
        if (user) {
          this.authService.newUser();
          this.router.navigate(['/dashboard']);
        }
      }
    );
  }

  checkIdForm = new FormGroup({
    checkField: new FormControl(
      '',
      [Validators.required],
      [this.ffvs.notFoundValidator(shopCol, 'id')]
    ),
  });

  get checkField() {
    return this.checkIdForm.get('checkField');
  }

  EmailLinkForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get email() {
    return this.EmailLinkForm.get('email');
  }

  loginWithGoogle = () => this.authService.loginWithGoogle();

  onEmailLinkFormSubmit() {
    const email = this.email?.value!;

    const actionCodeSettings = {
      url: `${location.origin}/email-link-redirection`,
      handleCodeInApp: true,
    };

    this.authService.sendAuthLink(email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    const notificationMsg = `Le lien d'authentification vous a été envoyé à l'adresse "${email}"`;
    this.snackBar.open(notificationMsg, 'OK');
    this.EmailLinkForm.reset();
  }

  newShopDialog() {
    this.dialog.open(ShopRegisterComponent, {
      width: '35rem',
      hasBackdrop: true,
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.authStateSubscription?.unsubscribe();
  }
}
