import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-ge-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule],
  template: `<main class="children-container">
    <nav
      mat-tab-nav-bar
      mat-stretch-tabs="false"
      mat-align-tabs="center"
      [tabPanel]="tabPanel"
    >
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
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
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
      url: 'sell',
    },
    {
      name: 'Stock',
      url: 'stock',
    },
    {
      name: 'Aprovisionnement',
      url: 'purcharse',
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
