import { Routes } from "@angular/router";
import { DashboardSimpleComponent } from "./dashboard-simple/dashboard-simple.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    component: DashboardSimpleComponent,
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
];
