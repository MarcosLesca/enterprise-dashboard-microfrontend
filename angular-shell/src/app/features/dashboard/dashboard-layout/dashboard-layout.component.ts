import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ButtonComponent } from "../../../../lib/components/button.component";

// Simple inline navbar component since external one doesn't exist
@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link">
          {{ brandName }}
        </a>
      </div>
      <div class="navbar-menu">
        <ul class="nav-links">
          <li><a routerLink="/dashboard">Dashboard</a></li>
          <li><a routerLink="/dashboard/profile">Profile</a></li>
        </ul>
      </div>
    </nav>
  `,
  inputs: ["brandName", "variant"],
})
export class NavbarComponent {
  @Input() brandName: string = "";
  @Input() variant: "light" | "dark" | "transparent" = "light";
}

@Component({
  selector: "app-dashboard-layout",
  standalone: true,
  styleUrls: ["./dashboard-layout.component.css"],
  imports: [CommonModule, RouterLink, RouterOutlet, NavbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-navbar brandName="Enterprise Dashboard" [variant]="navbarVariant">
        <div menu>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            Dashboard
          </a>
          <a
            routerLink="/dashboard/analytics"
            routerLinkActive="active"
            class="nav-link"
          >
            📈 Analytics (React)
          </a>
          <a
            routerLink="/dashboard/profile"
            routerLinkActive="active"
            class="nav-link"
          >
            Profile
          </a>
        </div>

        <div user>
          <span class="user-info">
            {{ currentUser?.name || "User" }}
          </span>
                     <button class="btn btn-secondary btn-sm" (click)="logout()">
            Logout
          </app-button>
        </div>
      </app-navbar>

      <div class="dashboard-content">
        <div class="dashboard-sidebar">
          <nav class="sidebar-nav">
            <ul class="sidebar-menu">
              <li>
                <a
                  routerLink="/dashboard"
                  routerLinkActive="active"
                  class="sidebar-link"
                >
                  📊 Dashboard
                </a>
              </li>
              <li>
                <a
                  routerLink="/dashboard/analytics"
                  routerLinkActive="active"
                  class="sidebar-link"
                >
                  📈 Analytics (React)
                </a>
              </li>
              <li>
                <a
                  routerLink="/dashboard/profile"
                  routerLinkActive="active"
                  class="sidebar-link"
                >
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
})
export class DashboardLayoutComponent implements OnInit {
  currentUser = { name: "Demo User" };
  navbarVariant: "light" | "dark" | "transparent" = "light";

  constructor() {}

  ngOnInit() {
    // Demo data - en producción esto vendría del auth service
    this.currentUser = { name: "Admin User" };
  }

  logout() {
    // Demo logout - would clear auth state in real app
    console.log("Logout clicked");
  }
}
