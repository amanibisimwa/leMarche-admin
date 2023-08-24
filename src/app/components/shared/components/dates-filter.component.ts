import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    ReactiveFormsModule,
  ],
  template: `
    <div class="header" mat-dialog-title fxLayoutAlign="space-between start">
      <div>
        <h2>Filtrer par 2 dates</h2>
        <h3>
          Entrez 2 dates tout en séléctionnant la date debut et la date fin
        </h3>
      </div>
      <button mat-icon-button matTooltip="Fermez" mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-divider></mat-divider>
    <form
      [formGroup]="dateFilterForm"
      fxLayout="column"
      (ngSubmit)="onSubmit()"
    >
      <mat-form-field appearance="outline" fxFill>
        <mat-label>Date début</mat-label>
        <input matInput [matDatepicker]="pickerA" formControlName="startDate" />
        <mat-datepicker-toggle
          matSuffix
          [for]="pickerA"
        ></mat-datepicker-toggle>
        <mat-datepicker #pickerA></mat-datepicker>
        <mat-error *ngIf="dateFilterForm?.hasError('required')"
          >Date début svp!</mat-error
        >
      </mat-form-field>
      <mat-form-field appearance="outline" fxFill>
        <mat-label>Date fin</mat-label>
        <input matInput [matDatepicker]="pickerB" formControlName="endDate" />
        <mat-datepicker-toggle
          matSuffix
          [for]="pickerB"
        ></mat-datepicker-toggle>
        <mat-datepicker #pickerB></mat-datepicker>
        <mat-error *ngIf="dateFilterForm?.hasError('required')"
          >Date fin svp!</mat-error
        >
      </mat-form-field>
      <div class="actions" fxFlexAlign="end">
        <button
          mat-flat-button
          mat-dialog-close
          color="primary"
          [disabled]="dateFilterForm.invalid || isDisabledBtn"
          type="submit"
        >
          Filtrer
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      form,
      button {
        margin-top: 1rem;
      }

      h2,
      h3 {
        margin-bottom: 0rem;
      }

      mat-checkbox {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DatesFilterComponent {
  isDisabledBtn = false;
  private uts = inject(UtilityService);

  dateFilterForm = new FormGroup({
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null, [Validators.required]),
  });

  onSubmit() {
    this.isDisabledBtn = true;
    const startDate = this.dateFilterForm.value.startDate!;
    const endDate = this.dateFilterForm.value.endDate!;
    this.uts.dateFilter(startDate, endDate);
  }
}
