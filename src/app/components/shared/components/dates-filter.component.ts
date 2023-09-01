import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dates-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  template: `
    <h1 mat-dialog-title>Sélectionnez un interval pour votre filtre</h1>
    <mat-divider></mat-divider>

    <mat-form-field mat-dialog-content appearance="outline">
      <mat-label>Entrez une plage de dates</mat-label>
      <mat-date-range-input [formGroup]="dateRangeForm" [rangePicker]="picker">
        <input
          matStartDate
          formControlName="start"
          placeholder="Date de début"
        />
        <input matEndDate formControlName="end" placeholder="Date de fin" />
      </mat-date-range-input>
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
      <mat-error *ngIf="dateRangeForm.controls.start.hasError('required')"
        >Séléctionnez une date de début</mat-error
      >
      <mat-error *ngIf="dateRangeForm.controls.end.hasError('required')"
        >Séléctionnez une date de fin</mat-error
      >
      <mat-error
        *ngIf="
          !dateRangeForm.controls.end.hasError('required') &&
          dateRangeForm.controls.start.hasError('matStartDateInvalid')
        "
        >Date de début invalide</mat-error
      >
      <mat-error
        *ngIf="
          !dateRangeForm.controls.end.hasError('required') &&
          dateRangeForm.controls.end.hasError('matEndDateInvalid')
        "
        >Date de fin invalide</mat-error
      >
    </mat-form-field>

    <mat-divider></mat-divider>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Annuler</button>
      <button
        mat-flat-button
        mat-dialog-close
        color="primary"
        [disabled]="dateRangeForm.invalid || isDisabledBtn"
        (click)="onSubmit()"
      >
        Appliquer
      </button>
    </div>
  `,
  styles: [],
})
export class DatesFilterComponent {
  isDisabledBtn = false;
  subscription!: Subscription;
  private dateAdapter = inject(DateAdapter<Date>);
  private dialogData = inject(MAT_DIALOG_DATA);
  private gs = inject(GeStockService);

  ngOnInit(): void {
    this.dateAdapter.setLocale('fr');
  }

  dateRangeForm = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });

  onSubmit() {
    this.isDisabledBtn = true;
    const formValue = this.dateRangeForm.value;
    const colName = this.dialogData.collectionName;
    this.subscription = this.gs
      .queryByDateRange(formValue.start!, formValue.end!, colName)
      .subscribe((items) => {
        this.dialogData.tableDataSource.data = items;
      });
  }
}
