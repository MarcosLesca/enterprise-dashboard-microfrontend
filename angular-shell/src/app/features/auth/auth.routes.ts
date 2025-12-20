import { Routes } from "@angular/router";
import { SimpleLoginComponent } from "./simple-login/simple-login.component";
import { RegisterComponent } from "./register/register.component";

export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    component: SimpleLoginComponent,
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
