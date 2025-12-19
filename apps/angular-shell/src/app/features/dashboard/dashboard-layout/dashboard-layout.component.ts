import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent, ButtonComponent } from '@enterprise-dashboard/shared';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  styleUrls: ['./dashboard-layout.component.css', '../remotes.css'],
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NavbarComponent,
    ButtonComponent
  ],
  template: `
    <div class="dashboard-layout">
      <app-navbar
        brandName="Enterprise Dashboard"
        [variant]="navbarVariant"
      >
        <div menu>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            Dashboard
          </a>
          <a routerLink="/dashboard/analytics" routerLinkActive="active" class="nav-link">
            📈 Analytics (React)
          </a>
          <a routerLink="/dashboard/profile" routerLinkActive="active" class="nav-link">
            Profile
          </a>
        </div>
        
        <div user>
          <span class="user-info">
            {{ currentUser?.name || 'User' }}
          </span>
          <app-button
            buttonType="secondary"
            size="sm"
            (onClick)="logout()"
          >
            Logout
          </app-button>
        </div>
      </app-navbar>

      <div class="dashboard-content">
        <div class="dashboard-sidebar">
          <nav class="sidebar-nav">
            <ul class="sidebar-menu">
              <li>
                <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
                  📊 Dashboard
                </a>
              </li>
              <li>
                <a routerLink="/dashboard/analytics" routerLinkActive="active" class="sidebar-link">
                  📈 Analytics (React)
                </a>
              </li>
              <li>
                <a routerLink="/dashboard/profile" routerLinkActive="active" class="sidebar-link">
                  👤 Profile
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <main class="dashboard-main">
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  currentUser$ = this.authService.authState;
  currentUser = this.authService.currentUser;
  navbarVariant: 'light' | 'dark' | 'transparent' = 'light';

  constructor() {}

  ngOnInit() {
    // Demo data - en producción esto vendría del auth service
    this.currentUser = { name: 'Admin User' };
  }

  logout() {
    this.authService.logout();
  }
}