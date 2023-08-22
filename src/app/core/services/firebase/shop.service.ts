import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Shop } from '../../models/shop.model';
import { shopCol } from './_firestore.collection';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private fs: Firestore = inject(Firestore);
  private auth = inject(Auth);
  shopColRef = collection(this.fs, shopCol);
  newShop = (s: Shop) => setDoc(doc(this.fs, shopCol, s.id!), s);

  updateShop = () => {
    const shopId = localStorage.getItem('shopId');
    const { uid, email, displayName, photoURL } = this.auth.currentUser!;
    const owner: Partial<User> = { uid, email, displayName, photoURL };
    const shopDocRef = doc(this.fs, shopCol, shopId!);
    updateDoc(shopDocRef, { owner });
  };
}
