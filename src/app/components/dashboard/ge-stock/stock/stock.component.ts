import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { NewItemComponent } from './new-item/new-item.component';
import { HeaderTableActionComponent } from '../../../shared/components/header-table-action.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    NgOptimizedImage,
    HeaderTableActionComponent,
  ],
})
export default class StockComponent {
  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  btnLabel = 'Nouvel item';
  dialogComponent = NewItemComponent;
}
