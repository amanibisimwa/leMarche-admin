import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Timestamp } from '@angular/fire/firestore';
import { shopArchiveCol } from 'src/app/core/services/firebase/_firestore.collection';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `<div class="table-container mat-elevation-z1">
    <table mat-table [dataSource]="dataSource">
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
          *matCellDef="let archive; let i = index"
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          {{ i + 1 }}
        </td>
      </ng-container>

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Nom de l'article</th>
        <td mat-cell *matCellDef="let archive" class="truncate-cell">
          {{ archive.item.title }}
        </td>
      </ng-container>

      <ng-container matColumnDef="reason">
        <th
          mat-header-cell
          *matHeaderCellDef
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          Motif de déstockage
        </th>
        <td
          mat-cell
          *matCellDef="let archive"
          class="truncate-cell"
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          {{ archive.reason }}
        </td>
      </ng-container>

      <ng-container matColumnDef="created">
        <th
          mat-header-cell
          *matHeaderCellDef
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          Date d'ajout
        </th>
        <td
          mat-cell
          *matCellDef="let archive"
          [hidden]="
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'XSmall'
          "
        >
          {{ formatedDate(archive.created) }}
        </td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantité</th>
        <td mat-cell *matCellDef="let archive">
          {{ archive.quantity | number }}
        </td>
      </ng-container>

      <ng-container matColumnDef="sellingPrice">
        <th
          mat-header-cell
          *matHeaderCellDef
          [hidden]="(viewPoint$ | async) === 'XSmall'"
        >
          Prix de vente
        </th>
        <td
          mat-cell
          *matCellDef="let archive"
          [hidden]="(viewPoint$ | async) === 'XSmall'"
        >
          {{ archive.item.sellingPrice | number }}
        </td>
      </ng-container>

      <ng-container matColumnDef="sellingTotalPrice">
        <th mat-header-cell *matHeaderCellDef>PV total</th>
        <td mat-cell *matCellDef="let archive">
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
    'sellingPrice',
    'sellingTotalPrice',
  ];

  subscription!: Subscription;
  private fs = inject(FirestoreService);
  private us = inject(UtilityService);
  dataSource = this.fs.getCollectionData(shopArchiveCol);

  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  formatedDate = (timestamp: Timestamp) => this.us.getFormatedDate(timestamp);
}
