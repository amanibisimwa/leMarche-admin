import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
  ],
  template: `
    <div class="image-section">
      <img
        *ngFor="let imageUrl of imagesUrls"
        [src]="imageUrl"
        alt="matos image"
      />
      <input
        type="file"
        #selectImage
        style="display: none"
        (change)="selectFiles($event)"
        multiple
        accept=".png,.jpg,.jpeg"
      />
      <button
        class="add-image-btn"
        mat-icon-button
        color="primary"
        (click)="selectImage.click()"
        matTooltip="Ajouter une image"
        [disabled]="isDisabledBtn || imagesUrls.length === 4"
      >
        <mat-progress-spinner
          *ngIf="isDisabledBtn"
          mode="indeterminate"
          strokeWidth="2.5"
          diameter="40"
        ></mat-progress-spinner>
        <mat-icon *ngIf="!isDisabledBtn">add_photo_alternate</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .add-image-btn,
      img {
        height: 5rem;
        width: 5rem;
        object-fit: cover;
      }

      .add-image-btn {
        border: 1px solid gray;
        margin: 1rem 0;
        margin-left: 1rem;
      }

      img {
        margin: 1rem;
        margin-right: 0;
        border-radius: 4px;
      }

      .image-section {
        display: flex;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class ImagePickerComponent {
  @Input({ required: true }) imagesUrls: string[] = [];
  isDisabledBtn = false;
  private ss = inject(StorageService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {}

  selectFiles(event: any) {
    if (event.target.files) {
      const files = [...event.target.files];
      if (files.length <= 4) {
        this.isDisabledBtn = true;
        files.forEach(async (file) => {
          const imgUrl = await this.ss.uploadImgToStorage(file);
          this.imagesUrls.push(imgUrl);
          this.ss.imageUrls.set(this.imagesUrls);
          this.isDisabledBtn = false;
        });
      } else {
        this.snackBar.open("Vous ne pouvez qu'ajouté 4 images", 'OK');
      }
    }
  }
}
