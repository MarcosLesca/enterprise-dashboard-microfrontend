import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent,
    title: "Login - Enterprise Dashboard",
  },
  {
    path: "register",
    component: RegisterComponent,
    title: "Register - Enterprise Dashboard",
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
];
