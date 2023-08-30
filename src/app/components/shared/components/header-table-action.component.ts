import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentType } from '@angular/cdk/portal';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
import { DatesFilterComponent } from './dates-filter.component';
import { RouterLink } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';

@Component({
  selector: 'app-header-table-action',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  template: `
    <main>
      <mat-form-field class="search-input" appearance="outline">
        <input
          matInput
          [placeholder]="searchPlaceholder"
          (keyup)="applyFilter($event)"
          #input
        />
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      <div class="actions">
        <button mat-stroked-button color="primary" [matMenuTriggerFor]="menu">
          Filtrer
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="openDateRangeFilterDialog()">
            Intervale de dates
          </button>
          <a mat-menu-item (click)="clearFilter()"> Annuler le filtre </a>
        </mat-menu>
        <button
          mat-flat-button
          color="primary"
          (click)="openAddItemDialog()"
          *ngIf="
            (viewPoint$ | async) === 'XLarge' ||
            (viewPoint$ | async) === 'Large' ||
            (viewPoint$ | async) === 'Medium'
          "
        >
          {{ btnLabel }}
        </button>
        <button
          mat-mini-fab
          color="primary"
          (click)="openAddItemDialog()"
          *ngIf="
            (viewPoint$ | async) === 'XSmall' ||
            (viewPoint$ | async) === 'Small'
          "
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>
    </main>
  `,
  styles: [
    `
      main {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .search-input {
        flex-grow: 3;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .actions > * {
        flex-grow: 1;
        margin-left: 1rem;
      }

      .mat-mdc-form-field {
        font-weight: 300;

        ::ng-deep {
          .mat-mdc-form-field-infix,
          .mat-mdc-form-field-flex {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: max-content;
            padding: 0px;
          }

          .mat-mdc-form-field-subscript-wrapper {
            height: 0;
          }

          .mat-mdc-form-field-icon-prefix {
            padding: 0;

            .mat-icon {
              padding: 6px;
            }
          }
        }
      }
    `,
  ],
})
export class HeaderTableActionComponent {
  @Input({ required: true }) btnLabel!: string;
  @Input({ required: true }) searchPlaceholder!: string;
  @Input({ required: true }) collectionName!: string;
  @Input({ required: true }) dialogComponent!: ComponentType<unknown>;
  @Input({ required: true }) tableDataSource!: MatTableDataSource<
    any,
    MatTableDataSourcePaginator
  >;

  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  private dialog = inject(MatDialog);
  private us = inject(UtilityService);

  openAddItemDialog() {
    this.dialog.open(this.dialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
    });
  }

  openDateRangeFilterDialog() {
    this.dialog.open(DatesFilterComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        tableDataSource: this.tableDataSource,
        collectionName: this.collectionName,
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  clearFilter = () => this.us.navigateOnTheSameUrl('/ge-stock/stock');
}
