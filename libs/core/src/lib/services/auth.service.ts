import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User, LoginRequest, LoginResponse } from "../models/auth.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get authState(): Observable<User | null> {
    return this.currentUser$;
  }

  constructor() {
    // Initialize from localStorage
    const userData = localStorage.getItem("current_user");
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // This should make an API call - for now, mock implementation
    return new Observable((observer) => {
      setTimeout(() => {
        const mockUser: User = {
          id: "1",
          email: credentials.email,
          name: "Admin User",
          role: "admin",
        };

        const response: LoginResponse = {
          user: mockUser,
          token: "mock-jwt-token",
        };

        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);

        observer.next(response);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token") && !!this.currentUser;
  }
}
