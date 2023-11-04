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
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Item } from 'src/app/core/models/item.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { Category } from 'src/app/core/models/item.category.model';

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
  styles: [
    `
      @use '../../../../shared/styles/form-field.style' as *;

      .margin-top {
        margin-top: 1rem;
      }
    `,
  ],
})
export class NewItemComponent {
  isDisabledBtn = false;
  private uts = inject(UtilityService);
  private fs = inject(FirestoreService);
  private ss = inject(StorageService);
  private snackBar = inject(MatSnackBar);
  imageUrls = this.ss.imageUrls;
  categories$ = this.fs.getCollectionData(this.fs.itemCategoryCollection);
  isOnline = this.uts.isOnline();

  readonly item: Item = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.item) {
      this.ss.imageUrls.set(this.item.imgUrls);
      this.addItemForm.patchValue(this.item);
    }
  }

  addItemForm = new FormGroup({
    id: this.item
      ? new FormControl('')
      : new FormControl(
          '',
          [Validators.required],
          [this.fs.alreadyExistInputValidator(this.fs.itemsCollection, 'id')]
        ),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl<Category | null>(null, [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    purchasePrice: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    sellingPrice: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    discountPrice: new FormControl<number | null>(null, [
      Validators.pattern(/^[.\d]+$/),
    ]),
    quantity: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
    satetyStock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
    ]),
  });

  onSubmit() {
    this.isDisabledBtn = true;
    const formValue = this.addItemForm.value;
    const newItemDocId = this.uts.toPascalCase(formValue.id!);

    const item: Item = {
      id: this.item ? this.item.id : newItemDocId,
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

    this.fs.setItem(item);
    this.imageUrls.set([]);
    const notificationMsg = `${item.title} enregistré avec succès`;
    this.snackBar.open(notificationMsg, '', { duration: 5000 });
  }
}
