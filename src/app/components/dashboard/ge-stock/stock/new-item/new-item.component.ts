import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImagePickerComponent } from 'src/app/components/shared/components/image-picker.component';
import { GeStockService } from 'src/app/core/services/firebase/ge-stock.service';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { FormFieldValidatorService } from 'src/app/core/services/firebase/form-field-validator.service';
import { itemCol } from 'src/app/core/services/firebase/_firestore.collection';
import { Item } from 'src/app/core/models/item.model';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-new-item',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    ImagePickerComponent,
    MatSelectModule,
  ],
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss'],
})
export class NewItemComponent {
  isDisabledBtn = false;
  private uts = inject(UtilityService);
  private gs = inject(GeStockService);
  private ss = inject(StorageService);
  private snackBar = inject(MatSnackBar);
  private ffvs = inject(FormFieldValidatorService);
  imageUrls = this.ss.imageUrls;
  categories$ = this.gs.getCategories;
  isOnline = this.uts.isOnline();

  addItemForm = new FormGroup({
    id: new FormControl(
      '',
      [Validators.required],
      [this.ffvs.alreadyExistInputValidator(itemCol, 'id', false)]
    ),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    purchasePrice: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    sellingPrice: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    discountPrice: new FormControl(null, [Validators.pattern(/^[.\d]+$/)]),
    quantity: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    satetyStock: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
  });

  get id() {
    return this.addItemForm.get('id');
  }
  get title() {
    return this.addItemForm.get('title');
  }
  get description() {
    return this.addItemForm.get('description');
  }
  get category() {
    return this.addItemForm.get('category');
  }
  get purchasePrice() {
    return this.addItemForm.get('purchasePrice');
  }
  get sellingPrice() {
    return this.addItemForm.get('sellingPrice');
  }
  get discountPrice() {
    return this.addItemForm.get('discountPrice');
  }
  get quantity() {
    return this.addItemForm.get('quantity');
  }
  get satetyStock() {
    return this.addItemForm.get('satetyStock');
  }

  onSubmit() {
    const item: Item = {
      id: this.id?.value!,
      title: this.title?.value!,
      description: this.description?.value!,
      category: this.category?.value!,
      purchasePrice: Number(this.purchasePrice?.value!),
      sellingPrice: Number(this.sellingPrice?.value!),
      discountPrice: Number(this.discountPrice?.value!),
      quantity: Number(this.quantity?.value!),
      satetyStock: Number(this.satetyStock?.value!),
      imgUrls: this.imageUrls(),
      created: serverTimestamp(),
    };

    this.gs.setItem(item);
    const notificationMsg = `${item.title} enregistré avec succès`;
    this.snackBar.open(notificationMsg, '', { duration: 5000 });
  }
}
