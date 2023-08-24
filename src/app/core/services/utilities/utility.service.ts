import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  croppedImage!: Promise<string>;

  toPascalCase(str: String) {
    const words = str.split(' ');
    const pascalCaseStr = words.map(
      (w) => w[0].toUpperCase() + w.substring(1).toLowerCase()
    );
    return pascalCaseStr.join('');
  }

  dateFilters?: Date[];
  dateFilter = (start: Date, end: Date) => (this.dateFilters = [start, end]);

  isOnline = async () => {
    try {
      await fetch('https://jsonplaceholder.typicode.com/todos/1');
      return true;
    } catch (error) {
      return false;
    }
  };
}
