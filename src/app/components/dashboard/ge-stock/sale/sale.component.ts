import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderTableActionComponent } from 'src/app/components/shared/components/header-table-action.component';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { saleCol } from 'src/app/core/services/firebase/_firestore.collection';
import { Sale } from 'src/app/core/models/sale.model';
import { CancelSaleComponent } from './cancel-sale.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-sale',
  standalone: true,
  templateUrl: './sale.component.html',
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
  styles: [
    `
      @use '../../../shared/styles/data-table.style' as *;
    `,
  ],
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
export default class SaleComponent {
  newSaleComponent = NewSaleComponent;
  saleCollection = saleCol;

  displayedColumns = [
    'position',
    'title',
    'quantity',
    'sellingPrice',
    'sellingTotalPrice',
    'profit',
    'totalProfit',
    'action',
  ];

  expandedSale?: Sale | null;
  subscription!: Subscription;
  private gs = inject(GeStockService);
  private us = inject(UtilityService);
  private dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Sale>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  formatedDate = (timestamp: Timestamp) => this.us.getFormatedDate(timestamp);

  ngOnInit() {
    this.subscription = this.gs
      .getCollectionData(saleCol)
      .subscribe((docData) => {
        const sales = docData as Sale[];
        this.dataSource.data = sales;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  saleTotalSum() {
    const totalSalePrices = this.dataSource.filteredData.map(
      (sale) => sale.item.sellingPrice * sale.quantity
    );
    return totalSalePrices.reduce((acc, value) => acc + value, 0);
  }

  profitTotalSum() {
    const totalProfit = this.dataSource.filteredData.map(
      (sale) =>
        (sale.item.sellingPrice - sale.item.purchasePrice) * sale.quantity
    );
    return totalProfit.reduce((acc, value) => acc + value, 0);
  }

  onCancelSale(sale: Sale) {
    this.dialog.open(CancelSaleComponent, {
      width: '25rem',
      hasBackdrop: true,
      disableClose: true,
      data: sale,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
