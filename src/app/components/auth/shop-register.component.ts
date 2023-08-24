import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ImageCroperDialogComponent } from './image-croper-dialog.component';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Shop } from 'src/app/core/models/shop.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { ShopService } from 'src/app/core/services/firebase/shop.service';
import { FormFieldValidatorService } from 'src/app/core/services/firebase/form-field-validator.service';
import { shopCol } from 'src/app/core/services/firebase/_firestore.collection';
import { base64ToFile } from 'ngx-image-cropper';
import { StorageService } from 'src/app/core/services/firebase/storage.service';

@Component({
  selector: 'app-shop-register',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <form [formGroup]="shopRegister">
      <h1 mat-dialog-title>Registrez votre shop</h1>
      <div mat-dialog-content>
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

        <div class="name-description">
          <mat-form-field appearance="outline">
            <mat-label>Nom du shop</mat-label>
            <input
              matInput
              placeholder="Ex: Computer Business"
              formControlName="name"
            />
            <mat-spinner
              matSuffix
              strokeWidth="2"
              diameter="20"
              *ngIf="name?.pending"
            ></mat-spinner>

            <mat-error
              *ngIf="
            name?.errors?.['alreadyExist'] &&
          !name?.errors?.['required']
        "
            >
              Ce shop existe déjà.
            </mat-error>
            <mat-error *ngIf="name?.hasError('required')"
              >Entrez un nom du shop</mat-error
            >
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Déscription du shop</mat-label>
            <input
              matInput
              placeholder="Ex: Boutique pour la vente des ordinateurs"
              formControlName="description"
            />
          </mat-form-field>
        </div>

        <div class="email-phone">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input
              matInput
              placeholder="Ex: example@gmail.com"
              formControlName="email"
            />
            <mat-error *ngIf="email?.hasError('email')"
              >Entrez une adresse mail</mat-error
            >
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>N° Télephone</mat-label>
            <input
              matInput
              placeholder="Ex: +24385401245"
              formControlName="phone"
            />
            <mat-error *ngIf="phone?.hasError('pattern')"
              >Entrez que des chiffres</mat-error
            >
          </mat-form-field>
        </div>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Annuler</button>
        <button
          mat-flat-button
          color="primary"
          mat-dialog-close
          (click)="onSubmit()"
          [disabled]="
            isDisabledFormBtn ||
            isCroppedImgPending ||
            name?.pending ||
            shopRegister.invalid
          "
        >
          Enregistrer
        </button>
      </div>
    </form>
  `,
  styles: [
    `
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

      .name-description > * {
        width: 100%;
      }

      .email-phone {
        display: flex;
        justify-content: space-between;

        * {
          flex-basis: 49%;
        }
      }

      mat-spinner {
        margin-right: 1rem;
      }
    `,
  ],
})
export class ShopRegisterComponent implements OnDestroy {
  croppedImage = '';
  isCroppedImgPending = false;

  dialogSubs!: Subscription;
  isDisabledFormBtn = false;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private uts = inject(UtilityService);
  private ffvs = inject(FormFieldValidatorService);
  private shopService = inject(ShopService);

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
      [this.ffvs.alreadyExistInputValidator(shopCol, 'id')]
    ),
    description: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl('', [Validators.pattern('^[0-9]*$')]),
  });

  get name(): AbstractControl | null {
    return this.shopRegister.get('name');
  }
  get description(): AbstractControl | null {
    return this.shopRegister.get('description');
  }
  get email(): AbstractControl | null {
    return this.shopRegister.get('email');
  }
  get phone(): AbstractControl | null {
    return this.shopRegister.get('phone');
  }

  onSubmit() {
    this.isDisabledFormBtn = true;

    const shopId = this.uts.toPascalCase(this.name?.value);

    const shop: Shop = {
      id: shopId,
      name: this.name?.value,
      description: this.description?.value,
      email: this.email?.value,
      phone: this.phone?.value,
      logoUrlImg: this.croppedImage,
      created: serverTimestamp(),
    };

    this.shopService.newShop(shop);
    const notificationMsg = `${shop.name} enregistré avec succès, voici votre identifiant: ${shop.id}`;
    this.snackBar.open(notificationMsg, 'OK');
  }

  ngOnDestroy(): void {
    this.dialogSubs?.unsubscribe();
  }
}
