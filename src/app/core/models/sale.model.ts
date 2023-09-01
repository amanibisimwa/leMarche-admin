import { Item } from './item.model';

export interface Sale {
  id: string;
  item: Item;
  quantity: number;
  isCanceled: boolean;
  created: any;
}
