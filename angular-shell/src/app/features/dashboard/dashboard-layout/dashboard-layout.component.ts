import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Brand -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="navbar-brand">
              {{ brandName }}
            </a>

            <!-- Main Navigation -->
            <div class="hidden md:flex items-center gap-1">
              <a
                routerLink="/dashboard"
                routerLinkActive="active"
                class="nav-link"
              >
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
          </div>

          <!-- User Actions -->
          <div class="flex items-center gap-4">
            <!-- Theme Toggle -->
            <button
              (click)="toggleTheme()"
              class="btn btn-ghost btn-sm"
              aria-label="Toggle theme"
            >
              <span class="theme-icon" *ngIf="!isDarkMode">🌙</span>
              <span class="theme-icon" *ngIf="isDarkMode">☀️</span>
            </button>

            <!-- User Info -->
            <div class="flex items-center gap-3">
              <span
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{ currentUser?.name || "User" }}
              </span>
              <div
                class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium"
              >
                {{ getUserInitials() }}
              </div>
            </div>

            <!-- Logout Button -->
            <button class="btn btn-secondary btn-sm" (click)="onLogout()">
              Logout
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            (click)="toggleMobileMenu()"
            class="md:hidden btn btn-ghost btn-sm"
            aria-label="Toggle mobile menu"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div
          class="md:hidden border-t border-gray-200 dark:border-gray-700"
          *ngIf="mobileMenuOpen"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="active"
              class="nav-link block px-3 py-2"
              (click)="closeMobileMenu()"
            >
              Dashboard
            </a>
            <a
              routerLink="/dashboard/analytics"
              routerLinkActive="active"
              class="nav-link block px-3 py-2"
              (click)="closeMobileMenu()"
            >
              📈 Analytics (React)
            </a>
            <a
              routerLink="/dashboard/profile"
              routerLinkActive="active"
              class="nav-link block px-3 py-2"
              (click)="closeMobileMenu()"
            >
              Profile
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  inputs: ["brandName", "variant"],
})
export class NavbarComponent {
  @Input() brandName = "";
  @Input() variant: "light" | "dark" | "transparent" = "light";
  @Input() currentUser: { name: string } | null = null;

  isDarkMode = false;
  mobileMenuOpen = false;

  constructor() {
    // Initialize theme
    this.isDarkMode = document.documentElement.classList.contains("dark");
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return "U";
    const names = this.currentUser.name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  logout() {
    console.log("Navbar logout clicked");
  }

  onLogout() {
    console.log("Navbar onLogout clicked");
  }
}

@Component({
  selector: "app-dashboard-layout",
  standalone: true,
  styleUrls: ["./dashboard-layout.component.css"],
  imports: [CommonModule, RouterLink, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar
        brandName="Enterprise Dashboard"
        [variant]="navbarVariant"
        [currentUser]="currentUser"
        (logout)="onLogout()"
      />

      <div class="sidebar-layout">
        <!-- Sidebar -->
        <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
          <div class="sidebar-header">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm font-bold"
              >
                ED
              </div>
              <div *ngIf="!sidebarCollapsed">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">
                  Enterprise
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Dashboard
                </p>
              </div>
            </div>
          </div>

          <nav class="sidebar-nav">
            <div class="sidebar-section">
              <h4 class="sidebar-section-title" *ngIf="!sidebarCollapsed">
                Main
              </h4>
              <a
                routerLink="/dashboard"
                routerLinkActive="active"
                class="sidebar-link"
                (click)="closeMobileSidebar()"
              >
                <svg
                  class="sidebar-link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <span class="sidebar-link-text">Dashboard</span>
              </a>
              <a
                routerLink="/dashboard/analytics"
                routerLinkActive="active"
                class="sidebar-link"
                (click)="closeMobileSidebar()"
              >
                <svg
                  class="sidebar-link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <span class="sidebar-link-text">Analytics (React)</span>
              </a>
              <a
                routerLink="/dashboard/profile"
                routerLinkActive="active"
                class="sidebar-link"
                (click)="closeMobileSidebar()"
              >
                <svg
                  class="sidebar-link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span class="sidebar-link-text">Profile</span>
              </a>
            </div>

            <div class="sidebar-section" *ngIf="!sidebarCollapsed">
              <h4 class="sidebar-section-title">Tools</h4>
              <a
                href="#"
                class="sidebar-link opacity-50 cursor-not-allowed"
                title="Coming soon"
              >
                <svg
                  class="sidebar-link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span class="sidebar-link-text">Settings</span>
              </a>
              <a
                href="#"
                class="sidebar-link opacity-50 cursor-not-allowed"
                title="Coming soon"
              >
                <svg
                  class="sidebar-link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
                <span class="sidebar-link-text">Documentation</span>
              </a>
            </div>
          </nav>

          <!-- Sidebar Footer -->
          <div
            class="sidebar-footer p-4 border-t border-gray-200 dark:border-gray-700 mt-auto"
          >
            <button
              (click)="toggleSidebar()"
              class="w-full btn btn-ghost btn-sm justify-center"
              [attr.aria-label]="
                sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              "
            >
              <svg
                class="w-4 h-4 transition-transform"
                [class.rotate-180]="sidebarCollapsed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                ></path>
              </svg>
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content flex-1">
          <div class="container mx-auto px-4 py-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent implements OnInit {
  currentUser: { name: string } | null = null;
  navbarVariant: "light" | "dark" | "transparent" = "light";
  sidebarCollapsed = false;

  constructor() {}

  ngOnInit() {
    // Demo data - en producción esto vendría del auth service
    this.currentUser = { name: "Admin User" };

    // Check screen size for sidebar state
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.checkScreenSize.bind(this));
  }

  onLogout() {
    // Demo logout - would clear auth state in real app
    console.log("Logout clicked");
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeMobileSidebar() {
    if (window.innerWidth < 768) {
      this.sidebarCollapsed = true;
    }
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      this.sidebarCollapsed = true;
    }
  }
}
