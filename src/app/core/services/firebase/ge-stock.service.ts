import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { categoryCol, itemCol } from './_firestore.collection';
import { Item } from '../../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class GeStockService {
  private fs: Firestore = inject(Firestore);
  itemColRef = collection(this.fs, itemCol);
  categoryColRef = collection(this.fs, categoryCol);

  setItem = (i: Item) => setDoc(doc(this.fs, itemCol, i.id), i);

  getCategories = collectionData(this.categoryColRef);
}
