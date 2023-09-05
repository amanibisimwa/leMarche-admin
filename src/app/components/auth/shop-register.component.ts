import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { ImageCroperDialogComponent } from '../shared/components/image-croper-dialog.component';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Shop } from 'src/app/core/models/shop.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormFieldValidatorService } from 'src/app/core/services/firebase/form-field-validator.service';
import { shopCollection } from 'src/app/core/services/firebase/_firestore.collection';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { appTitle } from 'src/app/app.config';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { AuthProviderComponent } from './auth-provider.component';
import { RouterModule } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-shop-register',
  standalone: true,
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ appName }}</mat-card-title>
        <mat-card-subtitle
          >Enregistrez votre shop et gérez-le en un clic <br />
          Avez-vous deja un shop ?
          <a mat-button color="primary" routerLink="/login"
            >Connectez-vous</a
          ></mat-card-subtitle
        >
      </mat-card-header>
      <mat-divider class="divider-header">></mat-divider>
      <mat-card-content class="login-container" class="mat-step-header">
        <mat-stepper linear #stepper>
          <mat-step label="Connectez-vous">
            <app-auth-provider />
          </mat-step>
          <mat-step label="Enregistrez votre shop">
            <form [formGroup]="shopRegister">
              <div>
                <input
                  class="input-file-picker"
                  type="file"
                  #selectImage
                  hidden
                  accept=".png,.jpg,.jpeg"
                  (change)="fileChangeEvent($event)"
                />
                <img
                  *ngIf="!croppedImage"
                  src="../../../assets/logo-placeholder.jpg"
                  class="shop-logo-img"
                  (click)="selectImage.click()"
                />
                <img
                  *ngIf="croppedImage"
                  class="shop-logo-img"
                  [src]="croppedImage"
                  (click)="selectImage.click()"
                />

                <mat-form-field appearance="outline" class="width-full">
                  <mat-label>Nom du shop</mat-label>
                  <input
                    matInput
                    placeholder="Ex: Computer Business"
                    formControlName="name"
                    #input
                    maxlength="25"
                  />
                  <mat-hint align="end"
                    >{{ input.value.length || 0 }}/25</mat-hint
                  >
                  <mat-spinner
                    matSuffix
                    strokeWidth="2"
                    diameter="20"
                    *ngIf="shopRegister.controls.name.pending"
                  ></mat-spinner>

                  <mat-error
                    *ngIf="
                      shopRegister.controls.name.hasError('alreadyExist') &&
                      !shopRegister.controls.name.hasError('required')
                    "
                  >
                    Ce shop existe déjà.
                  </mat-error>
                  <mat-error
                    *ngIf="shopRegister.controls.name.hasError('required')"
                    >Entrez un nom du shop</mat-error
                  >
                </mat-form-field>

                <mat-form-field appearance="outline" class="width-full">
                  <mat-label>Déscription du shop</mat-label>
                  <input
                    matInput
                    placeholder="Ex: Boutique pour la vente des ordinateurs"
                    formControlName="description"
                  />
                </mat-form-field>

                <div class="fied-in-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input
                      matInput
                      placeholder="Ex: example@gmail.com"
                      formControlName="email"
                    />
                    <mat-error
                      *ngIf="shopRegister.controls.name.hasError('email')"
                      >Entrez une adresse mail</mat-error
                    >
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>N° Télephone</mat-label>
                    <input
                      matInput
                      placeholder="Ex: 24385401245"
                      formControlName="phone"
                    />
                    <mat-error
                      *ngIf="shopRegister.controls.name.hasError('pattern')"
                      >Entrez que des chiffres</mat-error
                    >
                  </mat-form-field>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="action" align="end">
                <button
                  mat-flat-button
                  color="primary"
                  *ngIf="currentUser | async as user"
                  (click)="onSubmit(user)"
                  [disabled]="
                    isDisabledFormBtn ||
                    isCroppedImgPending ||
                    shopRegister.controls.name.pending ||
                    shopRegister.invalid
                  "
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </mat-step>
        </mat-stepper>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      @use '../shared/styles/form-field.style' as *;

      mat-card {
        width: max-content;
        margin: 1rem auto;
      }

      .divider-header {
        margin-top: 1rem;
      }

      .mat-step-header {
        pointer-events: none;
      }

      .shop-logo-img {
        height: 5rem;
        width: 5rem;
        display: block;
        border-radius: 50%;
        background: lightgray;
        margin: auto;
        margin-bottom: 1rem;
        object-fit: cover;

        &:hover {
          cursor: pointer;
          background: lightgrey;
        }
      }

      mat-spinner {
        margin-right: 1rem;
      }

      .action {
        margin-top: 1rem;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterModule,
    AuthProviderComponent,
  ],
})
export default class ShopRegisterComponent implements OnDestroy {
  appName = appTitle;
  croppedImage = '';
  isCroppedImgPending = false;
  isConnected = false;

  dialogSubs!: Subscription;
  isDisabledFormBtn = false;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private uts = inject(UtilityService);
  private ffvs = inject(FormFieldValidatorService);
  private fs = inject(FirestoreService);
  private authService = inject(AuthService);
  authState$ = this.authService.authState;
  currentUser = this.authService.user;
  authStateSubscription!: Subscription;
  @ViewChild('stepper') stepper!: MatStepper;

  ngOnInit(): void {
    this.authStateSubscription = this.authState$.subscribe(
      (user: User | null) => {
        if (user) this.stepper.next();
      }
    );
  }

  ngOnDestroy() {
    this.dialogSubs?.unsubscribe();
    this.authStateSubscription?.unsubscribe();
  }

  fileChangeEvent(event: any): void {
    if (event.target.files) {
      let dialogRef = this.dialog.open(ImageCroperDialogComponent, {
        width: '30rem',
        disableClose: true,
        hasBackdrop: true,
        data: { event: event },
      });
      this.dialogSubs = dialogRef.afterClosed().subscribe(async () => {
        this.isCroppedImgPending = true;
        this.croppedImage = await this.uts.croppedImage;
        this.isCroppedImgPending = false;
      });
    }
  }

  shopRegister = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required],
      [this.ffvs.alreadyExistInputValidator(shopCollection, 'id')]
    ),
    description: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl('', [Validators.pattern('^[0-9]*$')]),
  });

  onSubmit(user: User) {
    this.isDisabledFormBtn = true;
    const formValue = this.shopRegister.value;
    const { displayName, email, photoURL, uid } = user;

    const shop: Shop = {
      id: uid,
      name: formValue.name!,
      description: formValue.description!,
      email: formValue.email!,
      phone: formValue.phone!,
      logoUrlImg: this.croppedImage,
      owner: {
        displayName,
        email,
        photoURL,
        uid,
      },
      created: serverTimestamp(),
    };

    this.fs.newShop(shop);
    const notificationMsg = `${shop.name} enregistré avec succès, voici votre identifiant: ${shop.id}`;
    this.snackBar.open(notificationMsg, 'OK');
  }
}
