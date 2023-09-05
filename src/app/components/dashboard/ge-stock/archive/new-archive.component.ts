import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Archieve } from 'src/app/core/models/archive.model';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { serverTimestamp } from '@firebase/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import {
  shopArchiveCol,
  shopItemCol,
} from 'src/app/core/services/firebase/_firestore.collection';

@Component({
  selector: 'app-new-archive',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  template: `
    <form [formGroup]="archiveForm">
      <h1 mat-dialog-title>Déstocker {{ item.title }}</h1>
      <mat-divider></mat-divider>

      <div mat-dialog-content class="fied-in-row">
        <mat-form-field appearance="outline">
          <mat-label>Motif de déstockage</mat-label>
          <input
            matInput
            placeholder="Ex: L'article expiré"
            formControlName="reason"
            #input
            maxlength="50"
          />
          <mat-hint align="end">{{ input.value.length || 0 }}/25</mat-hint>
          <mat-error *ngIf="archiveForm.controls.reason.hasError('required')"
            >la raison est obligatoire</mat-error
          >
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Quantité</mat-label>
          <input matInput placeholder="Ex: 10" formControlName="quantity" />
          <mat-error *ngIf="archiveForm.controls.quantity?.hasError('required')"
            >Indiquez la quantité svp !</mat-error
          >
          <mat-error
            *ngIf="
              archiveForm.controls.quantity?.hasError('pattern') &&
              !archiveForm.controls.quantity?.hasError('required')
            "
          >
            Entrez les chiffres
          </mat-error>
        </mat-form-field>
      </div>
      <mat-divider></mat-divider>
      <div class="actions" align="end" mat-dialog-actions>
        <button mat-stroked-button mat-dialog-close>Annuler</button>
        <button
          mat-flat-button
          mat-dialog-close
          color="primary"
          [disabled]="archiveForm.invalid || isDisabledBtn"
          (click)="onSubmit()"
        >
          Déstocker
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      @use '../../../shared/styles/dialog-form.style' as *;
    `,
  ],
})
export class NewArchiveComponent {
  isDisabledBtn = false;
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  public item = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {}

  archiveForm = new FormGroup({
    reason: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
  });

  onSubmit() {
    this.isDisabledBtn = true;
    const archiveDocID = this.fs.docId(shopArchiveCol);
    const formValue = this.archiveForm.value;

    const archieve: Archieve = {
      id: archiveDocID,
      reason: formValue.reason!,
      item: this.item,
      quantity: Number(formValue.quantity!),
      created: serverTimestamp(),
    };

    if (archieve.quantity < archieve.item.quantity) {
      archieve.item.quantity -= archieve.quantity;
      archieve.item.created = archieve.created;
      this.fs.setArchive(archieve);
      this.fs.setItem(archieve.item);
      this.snackBar.open(`Déstocké avec succès`, 'OK', { duration: 10000 });
    } else if (archieve.quantity === archieve.item.quantity) {
      this.fs.setArchive(archieve);
      this.fs.deleteDocData(shopItemCol, this.item.id!);
      this.snackBar.open(`Tout a été déstocké avec succès`, 'OK', {
        duration: 10000,
      });
    } else {
      this.snackBar.open(
        `Erreur!, La quantité choisie est superieure à celle dans le stock`,
        'OK'
      );
    }
  }
}
