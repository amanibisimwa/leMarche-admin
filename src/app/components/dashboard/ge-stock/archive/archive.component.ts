import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Archieve } from 'src/app/core/models/archive.model';
import { archiveCol } from 'src/app/core/services/firebase/_firestore.collection';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `<div class="table-container mat-elevation-z1">
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="position">
        <th
          mat-header-cell
          *matHeaderCellDef
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          N°
        </th>
        <td
          mat-cell
          *matCellDef="let archive"
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          {{ dataSource.filteredData.indexOf(archive) + 1 }}
        </td>
      </ng-container>

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Nom de l'article</th>
        <td mat-cell *matCellDef="let archive" class="truncate-cell">
          {{ archive.item.title }}
        </td>
      </ng-container>

      <ng-container matColumnDef="reason">
        <th mat-header-cell *matHeaderCellDef>Motif de déstockage</th>
        <td mat-cell *matCellDef="let archive" class="truncate-cell">
          {{ archive.reason }}
        </td>
      </ng-container>

      <ng-container matColumnDef="created">
        <th mat-header-cell *matHeaderCellDef>Motif de déstockage</th>
        <td mat-cell *matCellDef="let archive">
          {{ formatedDate(archive.created) }}
        </td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th
          mat-header-cell
          *matHeaderCellDef
          [hidden]="(viewPoint$ | async) === 'XSmall'"
        >
          Quantité
        </th>
        <td
          mat-cell
          *matCellDef="let archive"
          [hidden]="(viewPoint$ | async) === 'XSmall'"
        >
          {{ archive.quantity | number }}
        </td>
      </ng-container>

      <ng-container matColumnDef="sellingTotalPrice">
        <th
          mat-header-cell
          *matHeaderCellDef
          [hidden]="(viewPoint$ | async) === 'XSmall'"
        >
          Prix de vente total
        </th>
        <td
          mat-cell
          *matCellDef="let archive"
          [hidden]="(viewPoint$ | async) === 'XSmall'"
        >
          {{ archive.item.sellingPrice * archive.quantity | number }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </div> `,
  styles: [
    `
      .table-container {
        margin: 1rem;
      }
    `,
  ],
})
export default class ArchiveComponent {
  displayedColumns = [
    'position',
    'title',
    'reason',
    'created',
    'quantity',
    'sellingTotalPrice',
  ];

  subscription!: Subscription;
  private gs = inject(GeStockService);
  private us = inject(UtilityService);
  dataSource = new MatTableDataSource<Archieve>();

  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  formatedDate = (timestamp: Timestamp) => this.us.getFormatedDate(timestamp);

  ngOnInit() {
    this.subscription = this.gs
      .getCollectionData(archiveCol)
      .subscribe((docData) => {
        const archives = docData as Archieve[];
        this.dataSource.data = archives;
      });
  }
}
