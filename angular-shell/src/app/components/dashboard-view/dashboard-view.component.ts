import { Component, Input } from "@angular/core";

@Component({
  selector: "app-dashboard-view",
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard-container">
      <h1>Enterprise Dashboard</h1>
      <p>Dashboard está funcionando!</p>
    </div>
  `,
})
export class DashboardViewComponent {
  constructor() {}
}
