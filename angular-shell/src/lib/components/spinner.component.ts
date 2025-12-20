import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center justify-center"
      [class]="sizeClasses"
      [attr.aria-label]="ariaLabel"
    >
      <div class="spinner" [class]="colorClasses"></div>
    </div>
  `,
  styles: [
    `
      .spinner {
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
      }

      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border-width: 1.5px;
      }

      .spinner-md {
        width: 1.5rem;
        height: 1.5rem;
        border-width: 2px;
      }

      .spinner-lg {
        width: 2rem;
        height: 2rem;
        border-width: 3px;
      }

      .spinner-xl {
        width: 3rem;
        height: 3rem;
        border-width: 4px;
      }

      .spinner-primary {
        border-color: var(--color-primary-200);
        border-top-color: var(--color-primary-600);
      }

      .spinner-white {
        border-color: rgba(255, 255, 255, 0.25);
        border-top-color: white;
      }

      .spinner-gray {
        border-color: var(--color-gray-200);
        border-top-color: var(--color-gray-600);
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class SpinnerComponent {
  @Input() size: "sm" | "md" | "lg" | "xl" = "md";
  @Input() color: "primary" | "white" | "gray" = "primary";
  @Input() ariaLabel = "Loading...";

  get sizeClasses(): string {
    return `spinner-${this.size}`;
  }

  get colorClasses(): string {
    return `spinner-${this.color}`;
  }
}
