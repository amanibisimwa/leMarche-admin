import { Injectable, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  croppedImage!: Promise<string>;
  private router = inject(Router);

  toPascalCase(str: String) {
    const words = str.split(' ');
    const pascalCaseStr = words.map(
      (w) => w[0].toUpperCase() + w.substring(1).toLowerCase()
    );
    return pascalCaseStr.join('');
  }

  isOnline = async () => {
    try {
      await fetch('https://jsonplaceholder.typicode.com/todos/1');
      return true;
    } catch (error) {
      return false;
    }
  };

  getFormatedDate = (timestamp: Timestamp) => {
    return new Intl.DateTimeFormat('fr').format(
      timestamp ? timestamp.toDate() : new Date()
    );
  };

  async navigateOnTheSameUrl(urlName: string) {
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    this.router.navigateByUrl(`${urlName}`);
  }
}
