import { Item } from './item.model';

export interface Purchase {
  id: string;
  item: Item;
  quantity: number;
  created: any;
}
