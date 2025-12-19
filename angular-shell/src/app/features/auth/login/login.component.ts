import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService, LoginRequest } from "../../../services/api.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Enterprise Dashboard</h1>
          <p>Sign in to your account</p>
        </div>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="login-form"
        >
          <div class="form-group">
            <label for="email">Email/Username</label>
            <input
              [formControlName]="email"
              id="email"
              type="text"
              class="form-input"
              placeholder="admin"
              [disabled]="isLoading"
            />
            <div class="error-hint">Use "admin" for username</div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              [formControlName]="password"
              id="password"
              type="password"
              class="form-input"
              placeholder="Enterprise123!"
              [disabled]="isLoading"
            />
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Signing in...</span>
          </button>
        </form>

        <div class="login-footer">
          <p><strong>Test Credentials:</strong></p>
          <small>Username: admin | Password: Enterprise123!</small>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = "";
  email = "";
  password = "";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {
    // Redirect if already authenticated
    if (this.apiService.isAuthenticated()) {
      this.router.navigate(["/dashboard"]);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.apiService.login(credentials).subscribe({
      next: () => {
        const returnUrl =
          this.router.parseUrl(this.router.url).queryParams["returnUrl"] ||
          "/dashboard";
        this.router.navigate([returnUrl]);
      },
      error: (error: any) => {
        this.errorMessage = error.message || "Login failed. Please try again.";
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
