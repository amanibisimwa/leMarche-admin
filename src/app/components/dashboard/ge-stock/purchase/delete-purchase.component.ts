import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { serverTimestamp } from '@angular/fire/firestore';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { Purchase } from 'src/app/core/models/purchase.model';
import { purchaseCol } from 'src/app/core/services/firebase/_firestore.collection';

@Component({
  selector: 'app-delete-purchase',
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
        Voulez-vous supprimer cet approvisionnement de
        {{
          purchase.quantity +
            ' ' +
            purchase.item.unit +
            '(s) de ' +
            purchase.item.title
        }}
        ?
      </p>
    </div>
    <mat-divider></mat-divider>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Non</button>
      <button
        mat-flat-button
        mat-dialog-close
        color="warn"
        (click)="onSubmit()"
      >
        Oui
      </button>
    </div>
  `,
  styles: [],
})
export class DeletePurchaseComponent {
  isDisabledBtn = false;
  readonly purchase: Purchase = inject(MAT_DIALOG_DATA);
  private gs = inject(GeStockService);
  private snackBar = inject(MatSnackBar);

  onSubmit() {
    this.isDisabledBtn = false;
    const notificationMsg = `Vous ne pouvez pas retirer ${this.purchase.quantity} ${this.purchase.item.title} car vous ne disposé que de ${this.purchase.item.quantity}`;
    this.purchase.item.quantity -= this.purchase.quantity;
    this.purchase.item.created = serverTimestamp();

    //Enregistrement de modification de l'article
    //Suppression de l'Approvisionnement
    if (this.purchase.item.quantity > 0) {
      this.gs.setItem(this.purchase.item);
      this.gs.deleteDocData(purchaseCol, this.purchase.id);
    } else {
      this.snackBar.open(notificationMsg, 'OK');
    }
  }
}
