import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { appTitle } from './app.config';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashBoard = () => redirectLoggedInTo(['']);
const appName = 'LeMarché Portail Admin';

export const routes: Routes = [
  {
    path: 'login',
    title: `Login - ${appName}`,
    loadComponent: () => import('./components/auth/login.component'),
    ...canActivate(redirectLoggedInToDashBoard),
  },
  {
    path: 'email-link-redirection',
    title: `Redirection Email Link - ${appName}`,
    loadComponent: () =>
      import('./components/auth/email-link-redirection.component'),
    ...canActivate(redirectLoggedInToDashBoard),
  },
  {
    path: '',
    title: `Dashboard - ${appName}`,
    loadComponent: () => import('./components/dashboard/dashboard.component'),
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'ge-stock',
        title: `Gestion de stock - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/ge-stock/ge-stock.component'),
        children: [
          {
            path: 'sell',
            title: `Vente - ${appName}`,
            loadComponent: () =>
              import('./components/dashboard/ge-stock/sell/sell.component'),
          },
          {
            path: 'stock',
            title: `Stock - ${appName}`,
            loadComponent: () =>
              import('./components/dashboard/ge-stock/stock/stock.component'),
          },
          {
            path: 'purcharse',
            title: `Approvisionnement - ${appName}`,
            loadComponent: () =>
              import(
                './components/dashboard/ge-stock/purchase/purchase.component'
              ),
          },
          {
            path: 'archive',
            title: `Archive - ${appName}`,
            loadComponent: () =>
              import(
                './components/dashboard/ge-stock/archive/archive.component'
              ),
          },
          { path: '', pathMatch: 'full', redirectTo: 'sell' },
        ],
      },
      {
        path: 'finance',
        title: `Finance - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/finance/finance.component'),
      },
      {
        path: 'setting',
        title: `Paramètre - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/setting/setting.component'),
      },
      { path: '', pathMatch: 'full', redirectTo: 'ge-stock' },
    ],
  },
  { path: '**', redirectTo: '' },
];
