import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { SwitchThemeService } from 'src/app/core/services/utilities/switch-theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appTitle } from 'src/app/app.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
    MatTooltipModule,
    NgOptimizedImage,
  ],
  template: `<div class="dashboard-container">
    <mat-toolbar class="overwrite-toolbar-background-color">
      <div class="left-container">
        <button
          *ngIf="
            (viewPoint$ | async) === 'XSmall' ||
            (viewPoint$ | async) === 'Small' ||
            (viewPoint$ | async) === 'Medium'
          "
          (click)="drawer?.toggle()"
          mat-icon-button
          matTooltip="élargi le menu"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <a routerLink="" mat-button
          ><h1>{{ appName }}</h1></a
        >
      </div>
      <div class="img-profil">
        <img
          [matTooltip]="'Menu de ' + appName"
          [matMenuTriggerFor]="menu"
          width="40"
          height="40"
          [ngSrc]="
            user?.photoURL ??
            'https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png'
          "
          alt="Image de profile"
          ngSrcset="100w, 200w, 300w"
          sizes="50vw"
        />
      </div>

      <mat-menu #menu="matMenu">
        <button mat-menu-item>
          <mat-icon>manage_accounts</mat-icon>
          <span>Gérer votre compte</span>
        </button>
        <button mat-menu-item [matMenuTriggerFor]="themeMenu">
          <mat-icon>dark_mode</mat-icon>
          <span>Appearance</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logOut()">
          <mat-icon>logout</mat-icon>
          <span>Se déconnecter</span>
        </button>
      </mat-menu>

      <mat-menu #themeMenu="matMenu">
        <button mat-menu-item (click)="switchTheme('device-theme')">
          Theme de l'appreil
        </button>
        <button mat-menu-item (click)="switchTheme('light-theme')">
          Theme claire
        </button>
        <button mat-menu-item (click)="switchTheme('dark-theme')">
          Theme sombre
        </button>
      </mat-menu>
    </mat-toolbar>
    <mat-drawer-container class="drawer-container" autosize>
      <mat-drawer
        #drawer
        [mode]="
          (viewPoint$ | async) === 'Large' || (viewPoint$ | async) === 'XLarge'
            ? 'side'
            : 'over'
        "
        [opened]="
          (viewPoint$ | async) === 'Large' || (viewPoint$ | async) === 'XLarge'
        "
        class="drawer-sidenav"
      >
        <a
          class="link"
          routerLink="ge-stock"
          routerLinkActive="active-menu-link"
          mat-button
          *ngIf="viewPoint$ | async as vw"
          (click)="toggleDrawer(drawer, vw)"
        >
          <div class="item-menu">
            <mat-icon>inventory_2</mat-icon>
            <div>GeStock</div>
          </div>
        </a>

        <a
          class="link"
          routerLink="finance"
          routerLinkActive="active-menu-link"
          mat-button
          *ngIf="viewPoint$ | async as vw"
          (click)="toggleDrawer(drawer, vw)"
        >
          <div class="item-menu">
            <mat-icon>attach_money</mat-icon>
            <div>Finance</div>
          </div>
        </a>

        <a
          class="link"
          routerLink="setting"
          routerLinkActive="active-menu-link"
          mat-button
          *ngIf="viewPoint$ | async as vw"
          (click)="toggleDrawer(drawer, vw)"
        >
          <div class="item-menu">
            <mat-icon>settings</mat-icon>
            <div>Paramètres</div>
          </div>
        </a>
      </mat-drawer>

      <div class="sidenav-content">
        <router-outlet></router-outlet>
      </div>
    </mat-drawer-container>
  </div>`,
  styles: [
    `
      .dashboard-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .active-menu-link {
        background: #c12765;
      }

      .toolbar-container {
        position: sticky;
        top: 0%;
        z-index: 2;
      }

      mat-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-container {
          display: flex;
          align-items: center;
        }
      }

      img {
        border-radius: 50%;
        background: lightgray;
        margin-left: 1rem;
        cursor: pointer;
        transition: 250ms;

        &:hover {
          transform: scale(1.1);
        }
      }

      .drawer-container {
        flex-basis: 100%;
      }

      mat-drawer {
        width: 15rem;
      }

      .link {
        width: 100%;
        height: 3rem;
        border-radius: 0;
        margin-bottom: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .item-menu {
        margin-left: 1.2rem;
        display: flex;
        align-items: center;

        mat-icon {
          margin-right: 1rem;
        }
      }
    `,
  ],
})
export default class DashboardComponent {
  appName = appTitle;
  private authService = inject(AuthService);
  private router = inject(Router);
  user = this.authService.user;
  private sts = inject(SwitchThemeService);
  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();

  toggleDrawer(drawer: MatDrawer, viewPoint: string) {
    if (viewPoint === 'Large' || viewPoint === 'XLarge') {
      return null;
    } else {
      return drawer?.toggle();
    }
  }

  switchTheme = (theme: string) => this.sts.switchTheme(theme);

  logOut = async () => {
    await this.authService.logout();
    this.router.navigate(['/login']);
  };
}
