import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { purchaseCol } from 'src/app/core/services/firebase/_firestore.collection';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Purchase } from 'src/app/core/models/purchase.model';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Timestamp } from '@angular/fire/firestore';
import { HeaderTableActionComponent } from '../../../shared/components/header-table-action.component';
import { DeleteAlertDialogComponent } from 'src/app/components/shared/components/delete-alert-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    NgOptimizedImage,
    HeaderTableActionComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export default class PurchaseComponent {
  newPurchaseComponent = NewPurchaseComponent;
  purchaseCollection = purchaseCol;

  displayedColumns = [
    'position',
    'title',
    'quantity',
    'purchasePrice',
    'purchaseTotalPrice',
    'profit',
    'totalProfit',
    'action',
  ];

  expandedPurchase?: Purchase | null;
  subscription!: Subscription;
  private gs = inject(GeStockService);
  private us = inject(UtilityService);
  private dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Purchase>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  formatedDate = (timestamp: Timestamp) => this.us.getFormatedDate(timestamp);

  ngOnInit() {
    this.getPurchases();
  }

  getPurchases() {
    this.subscription = this.gs
      .getCollectionData(purchaseCol)
      .subscribe((docData) => {
        const purchases = docData as Purchase[];
        this.dataSource.data = purchases;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  purchaseTotalSum() {
    const totalPurchasePrices = this.dataSource.filteredData.map(
      (purchase) => purchase.item.purchasePrice * purchase.quantity
    );
    return totalPurchasePrices.reduce((acc, value) => acc + value, 0);
  }

  profitTotalSum() {
    const totalProfit = this.dataSource.filteredData.map(
      (purchase) =>
        (purchase.item.sellingPrice - purchase.item.purchasePrice) *
        purchase.quantity
    );
    return totalProfit.reduce((acc, value) => acc + value, 0);
  }

  onUpdatePurchase(purchase: Purchase) {
    this.dialog.open(NewPurchaseComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: purchase,
      autoFocus: false,
    });
  }

  onDeletePurchase(purchase: Purchase) {
    this.dialog.open(DeleteAlertDialogComponent, {
      width: '25rem',
      hasBackdrop: true,
      disableClose: true,
      data: { collection: purchaseCol, item: purchase },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
