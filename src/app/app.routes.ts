import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashBoard = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - LeMarché Admin',
    loadComponent: () => import('./components/auth/login.component'),
    ...canActivate(redirectLoggedInToDashBoard),
  },
  {
    path: '',
    title: 'Dashboard - LeMarché Admin',
    loadComponent: () => import('./components/dashboard/dashboard.component'),
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'ge-stock',
        title: 'Gestion de stock - LeMarché Admin',
        loadComponent: () =>
          import('./components/dashboard/ge-stock/ge-stock.component'),
        children: [
          {
            path: 'sell',
            title: 'Vente - LeMarché Admin',
            loadComponent: () =>
              import('./components/dashboard/ge-stock/sell/sell.component'),
          },
          {
            path: 'stock',
            title: 'Stock - LeMarché Admin',
            loadComponent: () =>
              import('./components/dashboard/ge-stock/stock/stock.component'),
          },
          {
            path: 'purcharse',
            title: 'Approvisionnement - LeMarché Admin',
            loadComponent: () =>
              import(
                './components/dashboard/ge-stock/purchase/purchase.component'
              ),
          },
          {
            path: 'archive',
            title: 'Archive - LeMarché Admin',
            loadComponent: () =>
              import(
                './components/dashboard/ge-stock/archive/archive.component'
              ),
          },
        ],
      },
      {
        path: 'finance',
        title: 'Finance - LeMarché Admin',
        loadComponent: () =>
          import('./components/dashboard/finance/finance.component'),
      },
      {
        path: 'setting',
        title: 'Paramètre - LeMarché Admin',
        loadComponent: () =>
          import('./components/dashboard/setting/setting.component'),
      },
      { path: '', pathMatch: 'full', redirectTo: 'ge-stock' },
    ],
  },
  { path: '**', redirectTo: '' },
];
