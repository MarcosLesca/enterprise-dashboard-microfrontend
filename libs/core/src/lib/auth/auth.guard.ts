import { Injectable } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate: CanActivateFn = () => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (token) {
      return true;
    }

    // Not logged in, redirect to login
    this.router.navigate(["/auth/login"]);
    return false;
  };
}
