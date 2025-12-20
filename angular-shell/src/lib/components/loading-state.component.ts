import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./spinner.component";

@Component({
  selector: "app-loading-state",
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <div class="loading-state" [class.loading-overlay]="overlay">
      <div class="loading-content" [class.loading-content-overlay]="overlay">
        <app-spinner
          [size]="spinnerSize"
          [color]="spinnerColor"
          ariaLabel="Loading content..."
        ></app-spinner>

        <div *ngIf="message" class="loading-message">
          <p class="loading-message-text">{{ message }}</p>
          <p *ngIf="subMessage" class="loading-message-subtext">
            {{ subMessage }}
          </p>
        </div>

        <div *ngIf="showProgress" class="loading-progress">
          <div class="progress-bar">
            <div class="progress-bar-fill" [style.width.%]="progress"></div>
          </div>
          <span class="progress-text">{{ progress }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-8);
      }

      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: var(--z-index-modal);
      }

      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4);
        text-align: center;
      }

      .loading-content-overlay {
        background-color: var(--color-surface);
        padding: var(--space-8);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        max-width: 320px;
      }

      .loading-message {
        animation: fadeIn 0.3s ease-out;
      }

      .loading-message-text {
        font-size: var(--text-base);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        margin: 0;
      }

      .loading-message-subtext {
        font-size: var(--text-sm);
        color: var(--color-text-secondary);
        margin: var(--space-1) 0 0 0;
      }

      .loading-progress {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        width: 100%;
      }

      .progress-bar {
        flex: 1;
        height: 0.5rem;
        background-color: var(--color-gray-200);
        border-radius: var(--radius-full);
        overflow: hidden;
      }

      .progress-bar-fill {
        height: 100%;
        background-color: var(--color-primary-600);
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
      }

      .progress-text {
        font-size: var(--text-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
        min-width: 3rem;
        text-align: right;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Dark mode adjustments */
      @media (prefers-color-scheme: dark) {
        .loading-overlay {
          background-color: rgba(31, 41, 55, 0.9);
        }
      }

      .dark .loading-overlay {
        background-color: rgba(31, 41, 55, 0.9);
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .loading-message,
        .progress-bar-fill {
          animation: none !important;
          transition: none !important;
        }
      }

      /* Compact variant */
      .loading-state.compact {
        padding: var(--space-4);
      }

      .loading-state.compact .loading-content {
        gap: var(--space-2);
      }

      .loading-state.compact .loading-message-text {
        font-size: var(--text-sm);
      }

      /* Small variant */
      .loading-state.small {
        padding: var(--space-2);
      }

      .loading-state.small .loading-content {
        gap: var(--space-1);
        flex-direction: row;
      }

      .loading-state.small .loading-message {
        text-align: left;
      }
    `,
  ],
})
export class LoadingStateComponent {
  @Input() message?: string;
  @Input() subMessage?: string;
  @Input() spinnerSize: "sm" | "md" | "lg" | "xl" = "md";
  @Input() spinnerColor: "primary" | "white" | "gray" = "primary";
  @Input() overlay = false;
  @Input() showProgress = false;
  @Input() progress = 0;
  @Input() variant: "default" | "compact" | "small" = "default";

  get variantClasses(): string {
    return this.variant !== "default" ? this.variant : "";
  }
}
