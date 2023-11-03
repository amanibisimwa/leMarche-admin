import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-ge-stock',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatDividerModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  template: `<main class="children-container">
    <nav mat-tab-nav-bar mat-stretch-tabs="false" mat-align-tabs="center">
      <a
        mat-tab-link
        *ngFor="let link of links"
        (click)="activeLink = link.url"
        [active]="activeLink === link.url"
        [routerLink]="link.url"
      >
        {{ link.name }}
      </a>
    </nav>
    <mat-divider></mat-divider>
    <router-outlet></router-outlet>
  </main>`,
  styles: [],
})
export default class GeStockComponent {
  private router = inject(Router);
  activeLink?: string;
  links = [
    {
      name: 'Vente',
      url: 'sale',
    },
    {
      name: 'Aprovisionnement',
      url: 'purcharse',
    },
    {
      name: 'Stock',
      url: 'stock',
    },

    {
      name: 'Archive',
      url: 'archive',
    },
  ];

  ngOnInit(): void {
    this.activeLink = this.router.url.replace('/ge-stock/', '');
  }
}
