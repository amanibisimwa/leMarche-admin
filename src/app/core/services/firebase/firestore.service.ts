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
  getDoc,
} from '@angular/fire/firestore';
import { Item } from '../../models/item.model';
import { Archieve } from '../../models/archive.model';
import { Purchase } from '../../models/purchase.model';
import { Sale } from '../../models/sale.model';
import { Shop } from '../../models/shop.model';
import { Auth } from '@angular/fire/auth';
import { AbstractControl } from '@angular/forms';
import { debounceTime, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs: Firestore = inject(Firestore);
  private auth = inject(Auth);

  //Collection dans firestore
  shopCollection = 'shops';
  itemCategoryCollection = 'itemCategories';
  itemsCollection = `${this.shopCollection}/${this.auth.currentUser?.uid}/items`;
  archiveCollection = `${this.shopCollection}/${this.auth.currentUser?.uid}/archives`;
  purchaseCollection = `${this.shopCollection}/${this.auth.currentUser?.uid}/purchases`;
  saleCollection = `${this.shopCollection}/${this.auth.currentUser?.uid}/sales`;

  //Réference de la collection "shops" et ces sous collections de
  categoryColRef = collection(this.fs, this.itemCategoryCollection);
  shopColRef = collection(this.fs, this.shopCollection);
  itemColRef = collection(this.fs, this.itemsCollection);
  archiveColRef = collection(this.fs, this.archiveCollection);
  purchaseColRef = collection(this.fs, this.purchaseCollection);
  saleColRef = collection(this.fs, this.saleCollection);

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

  alreadyExistInputValidator(collectionName: string, fieldName: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      const collectionRef = collection(this.fs, collectionName);
      const queryDoc = query(collectionRef, where(fieldName, '==', value));
      return collectionData(queryDoc).pipe(
        debounceTime(500),
        take(1),
        map((arr) => (arr.length ? { alreadyExist: true } : null))
      );
    };
  }
}
