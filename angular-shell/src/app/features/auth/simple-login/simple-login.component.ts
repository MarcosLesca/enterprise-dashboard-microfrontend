import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
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

        <!-- Login Form -->
        <div
          class="mt-8 space-y-6 bg-white dark:bg-gray-800 py-8 px-6 rounded-lg shadow-lg"
        >
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email or Username
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="text"
                  [(ngModel)]="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="admin"
                  required
                />
              </div>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Use "admin" for demo
              </p>
            </div>

            <!-- Password -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  [(ngModel)]="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enterprise123!"
                  required
                />
              </div>
            </div>

            <!-- Error Message -->
            <div
              *ngIf="errorMessage"
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
            >
              <div class="text-sm text-red-600 dark:text-red-400">
                {{ errorMessage }}
              </div>
            </div>

            <!-- Remember Me -->
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
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                [disabled]="isLoading"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">Sign In</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Demo Credentials -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Demo Credentials
              </h3>
              <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> Enterprise123!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dark {
        color-scheme: dark;
      }
    `,
  ],
})
export class SimpleLoginComponent implements OnInit {
  email = "admin";
  password = "Enterprise123!";
  isLoading = false;
  errorMessage = "";

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if already authenticated (mock)
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      this.router.navigate(["/dashboard"]);
    }
  }

  onSubmit() {
    if (this.isLoading) return;

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = "Please fill in all fields";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    // Simulate API call
    setTimeout(() => {
      if (this.email === "admin" && this.password === "Enterprise123!") {
        // Store authentication
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name: "Admin User" }),
        );

        // Navigate to dashboard
        this.router.navigate(["/dashboard"]);
      } else {
        this.errorMessage = "Invalid credentials. Please try again.";
      }
      this.isLoading = false;
    }, 1000);
  }
}
