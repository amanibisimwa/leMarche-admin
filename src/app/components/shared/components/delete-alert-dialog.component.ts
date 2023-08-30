import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';

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
      <p class="warning-msg">
        Voulez-vous supprimer cette operation de
        {{
          data.item.quantity +
            ' ' +
            data.item.item.unit +
            '(s) de ' +
            data.item.item.title
        }}
        ?
      </p>
    </div>
    <mat-divider></mat-divider>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
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
  isDisabledBtn = false;
  readonly data = inject(MAT_DIALOG_DATA);
  private gs = inject(GeStockService);

  onSubmit() {
    this.isDisabledBtn = false;
    this.gs.deleteDocData(this.data.collection, this.data.item.id);
  }
}
