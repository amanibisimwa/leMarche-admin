import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription, Observable, startWith, map } from 'rxjs';
import { Item } from 'src/app/core/models/item.model';
import { Sale } from 'src/app/core/models/sale.model';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { serverTimestamp } from '@angular/fire/firestore';
import {
  shopItemCol,
  shopSaleCol,
} from 'src/app/core/services/firebase/_firestore.collection';

@Component({
  selector: 'app-new-sale',
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
  templateUrl: './new-sale.component.html',
  styles: [
    `
      @use '../../../../shared/styles/dialog-form.style' as *;
    `,
  ],
})
export class NewSaleComponent {
  isDisabledBtn = false;
  itemSub?: Subscription;
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);

  filteredItems?: Observable<Item[]>;
  displayFn = (item: Item) => (item ? item.title : '');

  private _itemFilter(itemTitle: string, items: Item[]) {
    const filterValue = itemTitle.toLowerCase();
    return items.filter((item) => {
      this.saleForm.controls['sellingPrice'].setValue(
        this.stockItemSellingPrice!
      );
      return item.title.toLowerCase().includes(filterValue);
    });
  }

  ngOnInit(): void {
    const items$ = this.fs.getCollectionData(shopItemCol) as Observable<Item[]>;

    this.itemSub = items$.subscribe((items) => {
      this.filteredItems = this.saleForm.controls['item'].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value!.title)),
        map((itemTitle) =>
          itemTitle ? this._itemFilter(itemTitle, items) : items.slice()
        )
      );
    });
  }

  saleForm = new FormGroup({
    item: new FormControl<Item | null>(null, [Validators.required]),
    sellingPrice: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    quantity: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
  });

  get stockItemSellingPrice() {
    return this.saleForm.value.item?.sellingPrice;
  }

  onSubmit() {
    this.isDisabledBtn = true;
    const saleDocID = this.fs.docId(shopSaleCol);
    const formValue = this.saleForm.value;

    const sale: Sale = {
      id: saleDocID,
      item: formValue.item!,
      quantity: Number(formValue.quantity!),
      isCanceled: false,
      created: serverTimestamp(),
    };

    if (typeof sale.item === 'object') {
      if (sale.item.quantity > 0) {
        //Modification de l'article en Stock
        sale.item.sellingPrice = Number(formValue.sellingPrice);
        sale.item.created = sale.created;
        sale.item.quantity -= sale.quantity;
        //Enregistrement de modification de l'article
        //Enregistrement de la nouvelle vente ou sa modification
        this.fs.setItem(sale.item);
        this.fs.setSale(sale);
        const notificationMsg = `${sale.item.title} vendu avec succès`;
        this.snackBar.open(notificationMsg, '', { duration: 10000 });
      } else {
        const toastMsg = `Erreur! Il ne reste que ${
          sale.item.quantity + sale.quantity
        } ${sale.item.title} en stock`;
        this.snackBar.open(toastMsg, 'OK');
      }
    } else {
      const toastMsg = `Erreur! Veuillez séléctionner un article à vendre`;
      this.snackBar.open(toastMsg, 'OK');
    }
  }

  ngOnDestroy(): void {
    this.itemSub?.unsubscribe();
  }
}
