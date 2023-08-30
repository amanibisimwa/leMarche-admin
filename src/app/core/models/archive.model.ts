import { Item } from './item.model';

export interface Archieve {
  id: string;
  reason: string;
  item: Item;
  quantity: number;
  created: any;
}
