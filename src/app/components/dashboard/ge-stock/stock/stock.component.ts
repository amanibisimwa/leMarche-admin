import {
  AfterViewInit,
  Component,
  Inject,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { NewItemComponent } from './new-item/new-item.component';
import { HeaderTableActionComponent } from '../../../shared/components/header-table-action.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Item } from 'src/app/core/models/item.model';
import { Subscription } from 'rxjs';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { NewArchiveComponent } from '../archive/new-archive.component';
import { itemCol } from 'src/app/core/services/firebase/_firestore.collection';

@Component({
  selector: 'app-stock',
  standalone: true,
  templateUrl: './stock.component.html',
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
})
export default class StockComponent {
  newItemComponent = NewItemComponent;
  itemCollection = itemCol;

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

  expandedItem?: Item | null;
  subscription!: Subscription;
  private gs = inject(GeStockService);
  dataSource = new MatTableDataSource<Item>();
  private us = inject(UtilityService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  formatedDate = (timestamp: Timestamp) => this.us.getFormatedDate(timestamp);

  ngOnInit() {
    this.subscription = this.gs
      .getCollectionData(itemCol)
      .subscribe((docData) => {
        const items = docData as Item[];
        this.dataSource.data = items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  sellingTotalSum() {
    const totalSellingPrices = this.dataSource.filteredData.map(
      (item) => item.sellingPrice * item.quantity
    );
    return totalSellingPrices.reduce((acc, value) => acc + value, 0);
  }

  profitTotalSum() {
    const totalProfit = this.dataSource.filteredData.map(
      (item) => (item.sellingPrice - item.purchasePrice) * item.quantity
    );
    return totalProfit.reduce((acc, value) => acc + value, 0);
  }

  onUpdateItem(item: Item) {
    this.dialog.open(NewItemComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: item,
    });
  }

  onArchiveItem(item: Item) {
    this.dialog.open(NewArchiveComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: item,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
