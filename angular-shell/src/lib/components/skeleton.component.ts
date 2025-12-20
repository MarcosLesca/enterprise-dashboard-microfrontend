import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-skeleton",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton"
      [class]="typeClasses"
      [style.width]="width"
      [style.height]="height"
    ></div>
  `,
  styles: [
    `
      .skeleton {
        background: linear-gradient(
          90deg,
          var(--color-gray-200) 0%,
          var(--color-gray-100) 50%,
          var(--color-gray-200) 100%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
        border-radius: var(--radius-sm);
      }

      .skeleton-text {
        height: 1rem;
        margin-bottom: 0.5rem;
      }

      .skeleton-text-sm {
        height: 0.75rem;
      }

      .skeleton-text-lg {
        height: 1.25rem;
      }

      .skeleton-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--radius-full);
      }

      .skeleton-button {
        height: var(--button-height-md);
        width: 6rem;
        border-radius: var(--radius-md);
      }

      .skeleton-card {
        height: 8rem;
        border-radius: var(--radius-lg);
      }

      .skeleton-card-compact {
        height: 6rem;
        border-radius: var(--radius-lg);
      }

      .skeleton-table {
        height: 2.5rem;
        margin-bottom: 0.25rem;
      }

      .skeleton-circle {
        border-radius: var(--radius-full);
      }

      .skeleton-rectangle {
        border-radius: var(--radius-md);
      }

      @keyframes skeleton-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Dark mode adjustments */
      @media (prefers-color-scheme: dark) {
        .skeleton {
          background: linear-gradient(
            90deg,
            var(--color-gray-700) 0%,
            var(--color-gray-600) 50%,
            var(--color-gray-700) 100%
          );
        }
      }

      .dark .skeleton {
        background: linear-gradient(
          90deg,
          var(--color-gray-700) 0%,
          var(--color-gray-600) 50%,
          var(--color-gray-700) 100%
        );
      }
    `,
  ],
})
export class SkeletonComponent {
  @Input() type:
    | "text"
    | "text-sm"
    | "text-lg"
    | "avatar"
    | "button"
    | "card"
    | "card-compact"
    | "table"
    | "circle"
    | "rectangle" = "text";
  @Input() width?: string;
  @Input() height?: string;

  get typeClasses(): string {
    return `skeleton-${this.type}`;
  }
}
