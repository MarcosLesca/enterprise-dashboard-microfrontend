import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PublicGuard implements CanActivate {
  canActivate(): boolean {
    // Public routes are always accessible
    return true;
  }
}
