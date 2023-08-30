import { inject, Injectable, signal } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  imageUrls = signal<any>([]);
  private storage = inject(Storage);

  //changerment de l'image vers Cloud Storage
  uploadImgToStorage = async (file: File | Blob) => {
    const filePath = `images/${Date.now()}`;
    const pathReference = ref(this.storage, filePath);
    const uploadTask = await uploadBytes(pathReference, file);
    localStorage.setItem('pathReference', uploadTask.ref.fullPath);
    return await getDownloadURL(pathReference);
  };
}
