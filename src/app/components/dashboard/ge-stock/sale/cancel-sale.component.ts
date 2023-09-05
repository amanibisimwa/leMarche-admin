import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { serverTimestamp } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { Sale } from 'src/app/core/models/sale.model';
import { Item } from 'src/app/core/models/item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-sale',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `<h1 mat-dialog-title>Annuler cette vente</h1>
    <mat-divider></mat-divider>
    <div mat-dialog-content>
      <p class="warning-msg">
        Voulez-vous annuler la vente de
        {{ sale.quantity + ' ' + sale.item.unit + '(s) de ' + sale.item.title }}
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
        *ngIf="itemInStock$ | async as item"
        (click)="onSubmit(item)"
      >
        {{ item.quantity }} + {{ sale.quantity }} =
        {{ item.quantity + sale.quantity }}
      </button>
    </div>`,
  styles: [],
})
export class CancelSaleComponent {
  isDisabledBtn = false;
  readonly sale: Sale = inject(MAT_DIALOG_DATA);
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  itemInStock$ = this.fs.getItem(this.sale.item.id) as Observable<Item>;

  onSubmit(item: Item) {
    this.isDisabledBtn = false;
    this.sale.isCanceled = true;
    this.sale.created = serverTimestamp();
    item.quantity += this.sale.quantity;
    item.created = this.sale.created;
    this.sale.quantity = 0;

    //Enregistrement de modification de l'article en stock et de la vente
    this.fs.setItem(item);
    this.fs.setSale(this.sale);
    const notificationMsg = `La vente de ${this.sale.item.title} annulé avec succès`;
    this.snackBar.open(notificationMsg, '', { duration: 10000 });
  }
}
