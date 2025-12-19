import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval } from "rxjs";
import { CommonModule, DatePipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ApiService, Dashboard, Widget } from "../services/api.service";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
  ],
  providers: [],
  templateUrl: "./dashboard-view.component.html",
  styleUrls: ["./dashboard-view.component.css"],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  private dashboards: Dashboard[] = [];
  private widgets: Widget[] = [];
  private subscription: any;
  errorMessage = "";
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboards();
    this.subscribeToPolling();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadDashboards(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.apiService.getDashboards().subscribe({
      next: (dashboards) => {
        this.isLoading = false;
        this.dashboards = dashboards;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Failed to load dashboards. Please try again.";
        console.error("DashboardViewComponent Error:", error);
      },
    });
  }

  private subscribeToPolling(): void {
    this.subscription = interval(30000).subscribe(() => {
      this.apiService.getDashboards().subscribe({
        next: (dashboards) => {
          this.isLoading = false;
          this.dashboards = dashboards;
          this.errorMessage = "";
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = "Failed to refresh dashboards";
        },
      });
    });
  }
}
