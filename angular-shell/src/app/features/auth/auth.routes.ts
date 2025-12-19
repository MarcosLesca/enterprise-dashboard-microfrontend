import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PublicGuard } from '@enterprise-dashboard/core';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PublicGuard],
    title: 'Login - Enterprise Dashboard'
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [PublicGuard],
    title: 'Register - Enterprise Dashboard'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];