import { Injectable, inject } from '@angular/core';
import {
  collection,
  collectionGroup,
  where,
  collectionData,
  Firestore,
  query,
} from '@angular/fire/firestore';
import { AbstractControl } from '@angular/forms';
import { debounceTime, take, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormFieldValidatorService {
  private fs: Firestore = inject(Firestore);

  alreadyExistInputValidator(
    collectionName: string,
    fieldName: string,
    isSubCollection?: boolean
  ) {
    return (control: AbstractControl) => {
      const queryDataRef = this.queryCollectionOrSubCollection(
        control,
        collectionName,
        fieldName,
        isSubCollection
      );
      return collectionData(queryDataRef).pipe(
        debounceTime(500),
        take(1),
        map((arr) => (arr.length ? { alreadyExist: true } : null))
      );
    };
  }

  notFoundValidator(
    collectionName: string,
    fieldName: string,
    isSubCollection?: boolean
  ) {
    return (control: AbstractControl) => {
      const queryDataRef = this.queryCollectionOrSubCollection(
        control,
        collectionName,
        fieldName,
        isSubCollection
      );
      return collectionData(queryDataRef).pipe(
        debounceTime(500),
        take(1),
        map((arr) => (arr.length ? null : { notFound: true }))
      );
    };
  }

  queryCollectionOrSubCollection(
    control: AbstractControl,
    collectionName: string,
    fieldName: string,
    isSubCollection?: boolean
  ) {
    const value = control.value;
    localStorage.setItem('shopId', value);
    const colRef = collection(this.fs, collectionName);
    const subColRef = collectionGroup(this.fs, collectionName);

    const queryCol = query(colRef, where(fieldName, '==', value));
    const querySubCol = query(subColRef, where(fieldName, '==', value));

    return isSubCollection ? querySubCol : queryCol;
  }
}
