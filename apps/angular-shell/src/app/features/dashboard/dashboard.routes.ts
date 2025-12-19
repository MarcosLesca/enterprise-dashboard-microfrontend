import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AuthGuard } from '@enterprise-dashboard/core';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
        title: 'Dashboard - Enterprise Dashboard'
      },
        {
          path: 'analytics',
          component: () => import('./analytics/analytics-remote.component').then(m => m.AnalyticsRemoteComponent),
          title: 'Analytics - Enterprise Dashboard'
        },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.routes').then(m => m.PROFILE_ROUTES),
        title: 'Profile - Enterprise Dashboard'
      }
    ]
  }
];