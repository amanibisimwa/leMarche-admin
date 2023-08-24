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
  ],
  template: `
    <main>
      <mat-form-field class="search-input" appearance="outline">
        <input matInput [placeholder]="searchPlaceholder" #input />
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      <div class="actions">
        <button mat-stroked-button color="primary" [matMenuTriggerFor]="menu">
          Filtrer
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item>Intervale de dates</button>
          <button mat-menu-item>Annuler le filtre</button>
        </mat-menu>
        <button
          mat-flat-button
          color="primary"
          (click)="openDialog()"
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
          (click)="openDialog()"
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
  @Input({ required: true }) dialogComponent!: ComponentType<unknown>;
  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  private dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(this.dialogComponent, {
      width: '35rem',
      hasBackdrop: true,
      disableClose: true,
    });
  }
}
