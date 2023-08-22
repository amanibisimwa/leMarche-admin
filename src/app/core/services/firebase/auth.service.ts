import { inject, Injectable } from '@angular/core';
import {
  ActionCodeSettings,
  Auth,
  authState,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  linkWithRedirect,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { userCol } from './_firestore.collection';
import { ShopService } from './shop.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private fs = inject(Firestore);
  private ss = inject(ShopService);

  user = this.auth.currentUser;
  authState = authState(this.auth);

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  sendAuthLink(email: string, acs: ActionCodeSettings) {
    return sendSignInLinkToEmail(this.auth, email, acs);
  }

  async loginWithEmailLink() {
    if (isSignInWithEmailLink(this.auth, location.href)) {
      let email = localStorage.getItem('emailForSignIn');

      if (!email) {
        email = prompt('Veuillez fournir votre e-mail pour la confirmation');
      }

      await signInWithEmailLink(this.auth, email!, location.href);
      linkWithRedirect(this.auth.currentUser!, new GoogleAuthProvider());
    }
  }

  logout = () => signOut(this.auth);

  async newUser() {
    const userDocRef = doc(this.fs, userCol, `${this.auth.currentUser?.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const { uid, email, displayName, photoURL } = this.auth.currentUser!;
      setDoc(userDocRef, { uid, email, displayName, photoURL });
      this.ss.updateShop();
    }
  }
}
