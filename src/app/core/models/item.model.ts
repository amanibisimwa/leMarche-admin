import { Category } from './item.category.model';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  imgUrls: string[];
  purchasePrice: number;
  sellingPrice: number;
  discountPrice: number;
  quantity: number;
  unit: string;
  satetyStock: number;
  created: any;
}
