import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
import {
  categoryCol,
  itemCol,
} from 'src/app/core/services/firebase/_firestore.collection';
import { Item } from 'src/app/core/models/item.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { Category } from 'src/app/core/models/shop.category.model';

@Component({
  selector: 'app-new-item',
  standalone: true,
  imports: [
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
  categories$ = this.gs.getCollectionData(categoryCol);
  isOnline = this.uts.isOnline();

  readonly item: Item = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.item) {
      this.ss.imageUrls.set(this.item.imgUrls);
      this.addItemForm.patchValue(this.item as any);
    }
  }

  addItemForm = new FormGroup({
    id: this.item
      ? new FormControl('')
      : new FormControl(
          '',
          [Validators.required],
          [this.ffvs.alreadyExistInputValidator(itemCol, 'id', false)]
        ),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl<Category | null>(null, [Validators.required]),
    unit: new FormControl('', [Validators.required]),
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

  onSubmit() {
    const formValue = this.addItemForm.value;
    const itemDocId = this.uts.toPascalCase(formValue.id!);

    const item: Item = {
      id: itemDocId,
      title: formValue.title!,
      description: formValue.description!,
      category: formValue.category!,
      unit: formValue.unit!,
      purchasePrice: Number(formValue.purchasePrice!),
      sellingPrice: Number(formValue.sellingPrice!),
      discountPrice: Number(formValue.discountPrice!),
      quantity: Number(formValue.quantity!),
      satetyStock: Number(formValue.satetyStock!),
      imgUrls: this.imageUrls(),
      created: serverTimestamp(),
    };

    this.gs.setItem(item);
    const notificationMsg = `${item.title} enregistré avec succès`;
    this.snackBar.open(notificationMsg, '', { duration: 5000 });
  }
}
