import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { archiveCol, categoryCol, itemCol } from './_firestore.collection';
import { Item } from '../../models/item.model';
import { Observable, map } from 'rxjs';
import { Archieve } from '../../models/archive.model';

@Injectable({
  providedIn: 'root',
})
export class GeStockService {
  private fs: Firestore = inject(Firestore);

  //Generate local Document Id
  docId = (colName: string) => doc(collection(this.fs, colName)).id;

  //Set or Add docs
  setItem = (i: Item) => setDoc(doc(this.fs, itemCol, i.id), i);
  setArchive = (a: Archieve) => setDoc(doc(this.fs, archiveCol, a.id!), a);

  //Get data from firestore
  getCollectionData(colName: string) {
    const collectionRef = collection(this.fs, colName);
    const queryDocsByDate = query(collectionRef, orderBy('created', 'desc'));
    return collectionData(queryDocsByDate);
  }

  //Query by Date ranges
  queryByDateRange(start: Date, end: Date, colName: string) {
    const queryDoc = query(
      collection(this.fs, colName),
      where('created', '>=', start),
      where('created', '<=', end),
      orderBy('created', 'desc')
    );
    return collectionData(queryDoc);
  }

  //delete docs
  deleteItem = (itemId: string) => deleteDoc(doc(this.fs, itemCol, itemId));
}
