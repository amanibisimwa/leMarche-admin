import { User } from '@angular/fire/auth';

export interface Shop {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  logoUrlImg?: string;
  owner?: Partial<User>;
  created: any;
}
