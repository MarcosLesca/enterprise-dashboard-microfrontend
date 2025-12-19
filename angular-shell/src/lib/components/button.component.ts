import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "enterprise-button",
  standalone: true,
  template: `
    <button
      [class]="buttonClass"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s ease;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #0056b3;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #545b62;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn-danger:hover:not(:disabled) {
        background: #c82333;
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() type: "primary" | "secondary" | "danger" = "primary";
  @Input() disabled = false;
  @Input() size: "small" | "medium" | "large" = "medium";
  @Output() onClick = new EventEmitter<Event>();

  get buttonClass(): string {
    const classes = [`btn-${this.type}`];
    if (this.size) {
      classes.push(`btn-${this.size}`);
    }
    return classes.join(" ");
  }
}
