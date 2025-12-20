import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService, LoginRequest } from "../../../services/api.service";

// Custom validator for demo credentials
function demoCredentialsValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (control.parent) {
    const email = control.parent.get("email")?.value;
    const password = control.parent.get("password")?.value;

    // For demo, allow admin/Enterprise123! or any valid email/password
    if (email === "admin" && password === "Enterprise123!") {
      return null;
    }

    // For real validation, we'd check actual email format
    if (email && email.includes("@") && password && password.length >= 8) {
      return null;
    }
  }

  return { invalidCredentials: true };
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div
            class="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <svg
              class="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
          </div>
          <h2
            class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100"
          >
            Enterprise Dashboard
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>

        <!-- Form -->
        <form
          class="mt-8 space-y-6 bg-white dark:bg-gray-800 py-8 px-6 rounded-lg shadow-lg"
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
        >
          <!-- Alert for errors -->
          <div *ngIf="errorMessage" class="alert alert-error" role="alert">
            <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div>
              <h4 class="font-medium">Authentication Error</h4>
              <p class="text-sm">{{ errorMessage }}</p>
            </div>
            <button
              type="button"
              class="alert-close"
              (click)="clearError()"
              aria-label="Dismiss error"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Email/Username Field -->
          <div class="form-group">
            <label for="email" class="form-label"> Email or Username </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <input
                formControlName="email"
                id="email"
                type="text"
                class="form-control pl-10"
                [class.form-control-error]="
                  email.invalid && (email.dirty || email.touched)
                "
                placeholder="admin or your@email.com"
                [disabled]="isLoading"
                aria-describedby="email-hint email-error"
              />
            </div>
            <p
              id="email-hint"
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              Use "admin" for demo or your email address
            </p>
            <div
              *ngIf="email?.invalid && (email?.dirty || email?.touched)"
              id="email-error"
              class="mt-1 text-sm text-error-600"
              role="alert"
            >
              <span *ngIf="email.hasError('required')">Email is required</span>
              <span
                *ngIf="email.hasError('email') && !email.hasError('required')"
                >Please enter a valid email</span
              >
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password" class="form-label"> Password </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                formControlName="password"
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                class="form-control pl-10 pr-10"
                [class.form-control-error]="
                  password.invalid && (password.dirty || password.touched)
                "
                placeholder="Enter your password"
                [disabled]="isLoading"
                aria-describedby="password-hint password-error"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                (click)="togglePasswordVisibility()"
                [disabled]="isLoading"
                aria-label="Toggle password visibility"
              >
                <svg
                  *ngIf="!showPassword"
                  class="h-4 w-4 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <svg
                  *ngIf="showPassword"
                  class="h-4 w-4 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              *ngIf="
                password?.invalid && (password?.dirty || password?.touched)
              "
              id="password-error"
              class="mt-1 text-sm text-error-600"
              role="alert"
            >
              <span *ngIf="password.hasError('required')"
                >Password is required</span
              >
            </div>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-gray-900 dark:text-gray-100"
              >
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="btn btn-primary btn-md w-full flex items-center justify-center"
              [disabled]="loginForm.invalid || isLoading"
              [class.btn-loading]="isLoading"
            >
              <svg
                *ngIf="!isLoading"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                ></path>
              </svg>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </div>
        </form>

        <!-- Demo Credentials Alert -->
        <div class="alert alert-info">
          <svg
            class="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div>
            <h4 class="font-medium">Demo Credentials</h4>
            <p class="text-sm mt-1">
              <strong>Username:</strong> admin<br />
              <strong>Password:</strong> Enterprise123!
            </p>
          </div>
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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["admin", [Validators.required]],
      password: ["Enterprise123!", [Validators.required]],
    });
  }

  ngOnInit() {
    // Redirect if already authenticated
    if (this.apiService.isAuthenticated()) {
      this.router.navigate(["/dashboard"]);
    }

    // Auto-focus email field
    setTimeout(() => {
      document.getElementById("email")?.focus();
    }, 100);
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLoading) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
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
        this.errorMessage =
          error.message ||
          "Login failed. Please check your credentials and try again.";
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.errorMessage = "";
  }

  // Getters for template access
  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }
}
