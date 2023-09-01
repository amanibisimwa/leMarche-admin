import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  where,
  docData,
} from '@angular/fire/firestore';
import {
  archiveCol,
  itemCol,
  purchaseCol,
  saleCol,
} from './_firestore.collection';
import { Item } from '../../models/item.model';
import { Archieve } from '../../models/archive.model';
import { Purchase } from '../../models/purchase.model';
import { Sale } from '../../models/sale.model';

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
  setSale = (s: Sale) => setDoc(doc(this.fs, saleCol, s.id!), s);

  //Récuperer un article en stock
  getItem = (itemId: string) => docData(doc(this.fs, itemCol, itemId));

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
