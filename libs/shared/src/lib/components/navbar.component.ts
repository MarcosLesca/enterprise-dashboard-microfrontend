import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "enterprise-navbar",
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>Enterprise Dashboard</h1>
      </div>
      <div class="navbar-menu">
        <ng-content></ng-content>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .navbar-brand h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
      }

      .navbar-menu {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
    `,
  ],
})
export class NavbarComponent {
  @Input() currentUser: any = null;
  @Output() logout = new EventEmitter<void>();
}
