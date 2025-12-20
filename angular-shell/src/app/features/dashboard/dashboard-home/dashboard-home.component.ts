import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SkeletonComponent } from "../../../../lib/components/skeleton.component";
import { LoadingStateComponent } from "../../../../lib/components/loading-state.component";
import { SpinnerComponent } from "../../../../lib/components/spinner.component";

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: "app-dashboard-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonComponent,
    LoadingStateComponent,
    SpinnerComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {{ currentUser.name || "User" }}!
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading">
        <app-loading-state
          message="Loading dashboard..."
          subMessage="Please wait while we fetch your data"
          [overlay]="true"
        ></app-loading-state>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!isLoading" class="space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let stat of stats; trackBy: trackByTitle" class="card">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ stat.title }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1"
                >
                  {{ stat.value }}
                </p>
                <div *ngIf="stat.change" class="flex items-center mt-2">
                  <svg
                    class="w-4 h-4 mr-1"
                    [class.text-success-600]="isPositive(stat.change)"
                    [class.text-error-600]="!isPositive(stat.change)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      *ngIf="isPositive(stat.change)"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    ></path>
                    <path
                      *ngIf="!isPositive(stat.change)"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    ></path>
                  </svg>
                  <span
                    class="text-sm font-medium"
                    [class.text-success-600]="isPositive(stat.change)"
                    [class.text-error-600]="!isPositive(stat.change)"
                  >
                    {{ stat.change }}
                  </span>
                </div>
              </div>

              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center text-lg"
                [style.background-color]="stat.color + '20'"
                [style.color]="stat.color"
              >
                {{ stat.icon }}
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Loading for Stats -->
        <div
          *ngIf="showStatsSkeleton"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div *ngFor="let i of [1, 2, 3, 4]" class="card">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <app-skeleton type="text-sm" width="60%"></app-skeleton>
                <app-skeleton
                  type="text-lg"
                  width="40%"
                  class="mt-2"
                ></app-skeleton>
                <app-skeleton
                  type="text-sm"
                  width="50%"
                  class="mt-2"
                ></app-skeleton>
              </div>
              <app-skeleton
                type="circle"
                width="3rem"
                height="3rem"
              ></app-skeleton>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div>
          <h2
            class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6"
          >
            Quick Actions
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              *ngFor="let action of quickActions; trackBy: trackByTitle"
              [routerLink]="action.route"
              class="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
                >
                  {{ action.icon }}
                </div>
                <div class="flex-1">
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1"
                  >
                    {{ action.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {{ action.description }}
                  </p>
                  <span
                    *ngIf="action.badge"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [class]="getBadgeClass(action.badge)"
                  >
                    {{ action.badge }}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Recent Activity (with loading state) -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h2>
            <button
              (click)="refreshActivity()"
              [disabled]="refreshingActivity"
              class="btn btn-ghost btn-sm"
            >
              <app-spinner
                *ngIf="refreshingActivity"
                size="sm"
                color="primary"
              ></app-spinner>
              <svg
                *ngIf="!refreshingActivity"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Refresh
            </button>
          </div>

          <!-- Activity List or Skeleton -->
          <div
            *ngIf="!refreshingActivity && activities.length > 0"
            class="space-y-4"
          >
            <div
              *ngFor="let activity of activities; trackBy: trackById"
              class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                [style.background-color]="activity.color + '20'"
                [style.color]="activity.color"
              >
                {{ activity.icon }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ activity.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>

          <!-- Activity Skeleton -->
          <div
            *ngIf="refreshingActivity || activities.length === 0"
            class="space-y-4"
          >
            <div
              *ngFor="let i of [1, 2, 3, 4, 5]"
              class="flex items-center gap-4"
            >
              <app-skeleton
                type="circle"
                width="2rem"
                height="2rem"
              ></app-skeleton>
              <div class="flex-1">
                <app-skeleton type="text" width="70%"></app-skeleton>
                <app-skeleton
                  type="text-sm"
                  width="40%"
                  class="mt-1"
                ></app-skeleton>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
            >
              System Status
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >API Server</span
                >
                <span class="status-badge status-online">Operational</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Database</span
                >
                <span class="status-badge status-online">Operational</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Cache</span
                >
                <span class="status-badge status-warning">Degraded</span>
              </div>
            </div>
          </div>

          <div class="card">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
            >
              Performance Metrics
            </h3>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >CPU Usage</span
                  >
                  <span class="text-sm font-medium">45%</span>
                </div>
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                >
                  <div
                    class="bg-primary-600 h-2 rounded-full"
                    style="width: 45%"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >Memory</span
                  >
                  <span class="text-sm font-medium">67%</span>
                </div>
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                >
                  <div
                    class="bg-warning-600 h-2 rounded-full"
                    style="width: 67%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./dashboard-home.component.css"],
})
export class DashboardHomeComponent implements OnInit {
  currentUser = { name: "Admin User" };
  isLoading = true;
  showStatsSkeleton = false;
  refreshingActivity = false;

  stats: StatCard[] = [];
  activities: Activity[] = [];
  quickActions: QuickAction[] = [];

  constructor() {}

  ngOnInit() {
    // Simulate initial loading
    setTimeout(() => {
      this.loadDashboardData();
      this.isLoading = false;
    }, 1500);

    // Show skeleton loading for stats demonstration
    setTimeout(() => {
      this.showStatsSkeleton = false;
    }, 2000);
  }

  loadDashboardData() {
    this.stats = [
      {
        title: "Total Users",
        value: "1,234",
        change: "+12%",
        icon: "👥",
        color: "#3b82f6",
      },
      {
        title: "Revenue",
        value: "$45,678",
        change: "+23%",
        icon: "💰",
        color: "#10b981",
      },
      {
        title: "Growth Rate",
        value: "+18%",
        change: "+5%",
        icon: "📈",
        color: "#8b5cf6",
      },
      {
        title: "Avg Response",
        value: "2.3s",
        change: "-15%",
        icon: "⚡",
        color: "#f59e0b",
      },
    ];

    this.activities = [
      {
        id: 1,
        title: "New user registration",
        time: "2 minutes ago",
        icon: "👤",
        color: "#10b981",
      },
      {
        id: 2,
        title: "Analytics report generated",
        time: "15 minutes ago",
        icon: "📊",
        color: "#3b82f6",
      },
      {
        id: 3,
        title: "System backup completed",
        time: "1 hour ago",
        icon: "💾",
        color: "#6b7280",
      },
    ];

    this.quickActions = [
      {
        title: "Analytics",
        description: "View detailed analytics and reports",
        icon: "📈",
        route: "/dashboard/analytics",
        badge: "React",
      },
      {
        title: "User Management",
        description: "Manage users and permissions",
        icon: "👥",
        route: "/dashboard/users",
      },
      {
        title: "Settings",
        description: "Configure system settings",
        icon: "⚙️",
        route: "/dashboard/settings",
      },
    ];
  }

  refreshActivity() {
    this.refreshingActivity = true;

    // Simulate API call
    setTimeout(() => {
      this.activities.unshift({
        id: Date.now(),
        title: "Activity refreshed",
        time: "Just now",
        icon: "🔄",
        color: "#3b82f6",
      });

      this.refreshingActivity = false;
    }, 1000);
  }

  isPositive(change: string): boolean {
    return change.startsWith("+");
  }

  getBadgeClass(badge: string): string {
    switch (badge.toLowerCase()) {
      case "react":
        return "badge-primary";
      case "angular":
        return "badge-error";
      case "new":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  }

  // TrackBy functions for performance
  trackByTitle(_index: number, item: { title: string }): string {
    return item.title;
  }

  trackById(_index: number, item: { id: number }): number {
    return item.id;
  }
}

interface Activity {
  id: number;
  title: string;
  time: string;
  icon: string;
  color: string;
}
