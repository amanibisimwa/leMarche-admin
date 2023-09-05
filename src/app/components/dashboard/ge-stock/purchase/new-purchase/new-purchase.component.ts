import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Item } from 'src/app/core/models/item.model';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, Observable, startWith, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Purchase } from 'src/app/core/models/purchase.model';
import { serverTimestamp } from '@angular/fire/firestore';
import {
  shopItemCol,
  shopPurchaseCol,
} from 'src/app/core/services/firebase/_firestore.collection';

@Component({
  selector: 'app-new-purchase',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './new-purchase.component.html',
  styles: [
    `
      @use '../../../../shared/styles/dialog-form.style' as *;
    `,
  ],
})
export class NewPurchaseComponent {
  isDisabledBtn = false;
  itemSub?: Subscription;
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  readonly purchase: Purchase = inject(MAT_DIALOG_DATA);
  readonly item$ = this.fs.getItem(this.purchase.item.id) as Observable<Item>;

  filteredItems?: Observable<Item[]>;
  displayFn = (item: Item) => (item ? item.title : '');

  private _itemFilter(itemTitle: string, items: Item[]) {
    const filterValue = itemTitle.toLowerCase();
    return items.filter((item) => {
      this.purchaseForm.controls['purchasePrice'].setValue(
        this.purchasePriceItemValueInStock!
      );
      this.purchaseForm.controls['sellingPrice'].setValue(
        this.sellingPriceItemValueInStock!
      );
      return item.title.toLowerCase().includes(filterValue);
    });
  }

  ngOnInit(): void {
    const items$ = this.fs.getCollectionData(shopItemCol) as Observable<Item[]>;

    this.itemSub = items$.subscribe((items) => {
      this.filteredItems = this.purchaseForm.controls['item'].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value!.title)),
        map((itemTitle) =>
          itemTitle ? this._itemFilter(itemTitle, items) : items.slice()
        )
      );
    });

    if (this.purchase)
      this.purchaseForm.patchValue({
        purchasePrice: this.purchase.item.purchasePrice,
        sellingPrice: this.purchase.item.sellingPrice,
        ...this.purchase,
      });
  }

  purchaseForm = new FormGroup({
    item: new FormControl<Item | null>(null, [Validators.required]),
    purchasePrice: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    sellingPrice: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    quantity: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
  });

  get purchasePriceItemValueInStock() {
    return this.purchaseForm.value.item?.purchasePrice;
  }
  get sellingPriceItemValueInStock() {
    return this.purchaseForm.value.item?.sellingPrice;
  }

  onSubmit(item: Item) {
    this.isDisabledBtn = true;
    const purchaseDocID = this.fs.docId(shopPurchaseCol);
    const formValue = this.purchaseForm.value;

    const purchase: Purchase = {
      id: purchaseDocID,
      item: formValue.item!,
      quantity: Number(formValue.quantity!),
      created: serverTimestamp(),
    };

    if (typeof purchase.item === 'object') {
      //Modification de l'article en Stock
      //Enregistrement de modification de l'article
      if (this.purchase) {
        item.purchasePrice = Number(formValue.purchasePrice);
        item.sellingPrice = Number(formValue.sellingPrice);
        item.quantity -= this.purchase.quantity;
        item.quantity += purchase.quantity;
        item.created = purchase.created;
        this.fs.setItem(item);
      } else {
        purchase.item.purchasePrice = Number(formValue.purchasePrice);
        purchase.item.sellingPrice = Number(formValue.sellingPrice);
        purchase.item.quantity += purchase.quantity;
        purchase.item.created = purchase.created;
        this.fs.setItem(purchase.item);
      }

      //Enregistrement du nouvel approvisionnement ou sa modification
      this.fs.setPurchase(purchase);
      const notificationMsg = `${purchase.item.title} enregistré avec succès`;
      this.snackBar.open(notificationMsg, '', { duration: 10000 });
    } else {
      this.isDisabledBtn = false;
      const toastMsg = `Erreur! Veuillez séléctionner un article`;
      this.snackBar.open(toastMsg, 'OK');
    }
  }

  ngOnDestroy(): void {
    this.itemSub?.unsubscribe();
  }
}
