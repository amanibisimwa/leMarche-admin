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
import {
  archiveCol,
  categoryCol,
  itemCol,
  purchaseCol,
} from './_firestore.collection';
import { Item } from '../../models/item.model';
import { Archieve } from '../../models/archive.model';
import { Purchase } from '../../models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class GeStockService {
  private fs: Firestore = inject(Firestore);

  //Générer un identifiant de document en local
  docId = (colName: string) => doc(collection(this.fs, colName)).id;

  //Creation ou modification d'un document
  setItem = (i: Item) => setDoc(doc(this.fs, itemCol, i.id), i);
  setArchive = (a: Archieve) => setDoc(doc(this.fs, archiveCol, a.id!), a);
  setPurchase = (p: Purchase) => setDoc(doc(this.fs, purchaseCol, p.id!), p);

  //Récupérer des données depuis une collection dans Firestore
  getCollectionData(colName: string) {
    const collectionRef = collection(this.fs, colName);
    const queryDocsByDate = query(collectionRef, orderBy('created', 'desc'));
    return collectionData(queryDocsByDate);
  }

  //Requête par plages de dates
  queryByDateRange(start: Date, end: Date, colName: string) {
    const queryDoc = query(
      collection(this.fs, colName),
      where('created', '>=', start),
      where('created', '<=', end),
      orderBy('created', 'desc')
    );
    return collectionData(queryDoc);
  }

  //supprimer un document
  deleteDocData(collectionName: string, docId: string) {
    const docRef = doc(this.fs, collectionName, docId);
    deleteDoc(docRef);
  }
}
