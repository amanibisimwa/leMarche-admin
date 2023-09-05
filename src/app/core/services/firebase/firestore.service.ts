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
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Item } from '../../models/item.model';
import { Archieve } from '../../models/archive.model';
import { Purchase } from '../../models/purchase.model';
import { Sale } from '../../models/sale.model';
import {
  shopArchiveCol,
  shopCollection,
  shopItemCol,
  shopPurchaseCol,
  shopSaleCol,
} from './_firestore.collection';
import { Shop } from '../../models/shop.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs: Firestore = inject(Firestore);

  //Réference des sous collections de la collection "shops"
  shopColRef = collection(this.fs, shopCollection);
  itemColRef = collection(this.fs, shopItemCol);
  archiveColRef = collection(this.fs, shopArchiveCol);
  purchaseColRef = collection(this.fs, shopPurchaseCol);
  saleColRef = collection(this.fs, shopSaleCol);

  //Générer un identifiant de document en local
  docId = (colName: string) => doc(collection(this.fs, colName)).id;

  //Creation ou modification d'un document
  newShop = (s: Shop) => setDoc(doc(this.shopColRef, s.id), s);
  setItem = (i: Item) => setDoc(doc(this.itemColRef, i.id), i);
  setArchive = (a: Archieve) => setDoc(doc(this.archiveColRef, a.id!), a);
  setPurchase = (p: Purchase) => setDoc(doc(this.purchaseColRef, p.id!), p);
  setSale = (s: Sale) => setDoc(doc(this.saleColRef, s.id!), s);

  async shopExists(shopId: string) {
    const shopDocRef = doc(this.shopColRef, shopId);
    const shopDoc = await getDoc(shopDocRef);
    return shopDoc.exists();
  }

  //Récuperer un article en stock
  getItem = (itemId: string) => docData(doc(this.itemColRef, itemId));

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
