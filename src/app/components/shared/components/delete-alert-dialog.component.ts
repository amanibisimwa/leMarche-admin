import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Item } from 'src/app/core/models/item.model';

@Component({
  selector: 'app-delete-alert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <h1 mat-dialog-title>Supprimer</h1>
    <mat-divider></mat-divider>
    <div mat-dialog-content>
      <h1 class="warning-msg">
        Voulez-vous supprimer cette operation de
        {{ item.quantity + ' de ' + item.title }} ?
      </h1>
    </div>
    <mat-divider></mat-divider>
    <div class="actions" align="end">
      <button mat-stroked-button mat-dialog-close color="primary">
        Annuler
      </button>
      <button
        mat-flat-button
        mat-dialog-close
        color="warn"
        (click)="onSubmit()"
      >
        Supprimer
      </button>
    </div>
  `,
  styles: [],
})
export class DeleteAlertDialogComponent {
  readonly item: Item = inject(MAT_DIALOG_DATA);

  onSubmit() {}
}
