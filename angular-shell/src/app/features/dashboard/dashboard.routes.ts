import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./dashboard-layout/dashboard-layout.component";
import { DashboardHomeComponent } from "./dashboard-home/dashboard-home.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    component: DashboardLayoutComponent,
    children: [
      {
        path: "",
        component: DashboardHomeComponent,
        title: "Dashboard - Enterprise Dashboard",
      },
      {
        path: "analytics",
        loadComponent: () =>
          import("./analytics/analytics-remote.component").then(
            (m) => m.AnalyticsRemoteComponent,
          ),
        title: "Analytics - Enterprise Dashboard",
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.routes").then((m) => m.PROFILE_ROUTES),
        title: "Profile - Enterprise Dashboard",
      },
    ],
  },
];
