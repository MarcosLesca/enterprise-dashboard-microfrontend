import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Renderer2,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MicroFrontendConfigService } from "../../../services/micro-frontend-config.service";

@Component({
  selector: "app-analytics-remote",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-remote-container">
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading Analytics...</p>
      </div>

      <div *ngIf="loadError" class="error-overlay">
        <div class="error-icon">⚠️</div>
        <p class="error-text">{{ loadError }}</p>
        <button class="retry-button" (click)="retryLoading()">Retry</button>
      </div>

      <iframe
        #analyticsFrame
        [src]="iframeSrc"
        [class.hidden]="isLoading || loadError !== null"
        title="Analytics Dashboard"
        frameborder="0"
        scrolling="auto"
        (load)="onIframeLoad()"
        (error)="onIframeError()"
      >
      </iframe>
    </div>
  `,
  styles: [
    `
      .analytics-remote-container {
        width: 100%;
        height: calc(100vh - 4rem);
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }

      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f4f6;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-text {
        font-size: 1rem;
        color: #6b7280;
        font-weight: 500;
      }

      .analytics-remote-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 0.75rem;
        transition: opacity 0.3s ease;
      }

      .analytics-remote-container iframe.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .error-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(239, 68, 68, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border: 2px dashed #ef4444;
        border-radius: 0.75rem;
      }

      .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .error-text {
        font-size: 1rem;
        color: #dc2626;
        font-weight: 500;
        text-align: center;
        max-width: 80%;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .retry-button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .retry-button:hover {
        background: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .retry-button:active {
        transform: translateY(0);
      }
    `,
  ],
})
export class AnalyticsRemoteComponent implements OnInit, OnDestroy {
  @ViewChild("analyticsFrame") analyticsFrame!: ElementRef<HTMLIFrameElement>;

  @Input() analyticsUrl?: string;
  @Input() timeout: number = 8000; // Configurable timeout

  isLoading = true;
  loadError: string | null = null;
  private timeoutId: any;
  private communicationSetup = false;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private cachedIframeSrc: SafeResourceUrl | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private mfConfig: MicroFrontendConfigService,
    private sanitizer: DomSanitizer,
  ) {
    // Cache SafeResourceUrl to prevent recreation
    const url = "http://localhost:4201/analytics";
    this.cachedIframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get iframeSrc(): SafeResourceUrl {
    // Return cached SafeResourceUrl instead of creating new one
    return this.cachedIframeSrc!;
  }

  ngOnInit() {
    console.log("🚀 AnalyticsRemoteComponent initialized");
    console.log("🔗 iframe src:", this.iframeSrc);

    // Setup configurable loading timeout
    this.timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.log("⏰ Loading timeout reached, showing error");
        this.loadError = `Analytics dashboard couldn't load within ${this.timeout}ms`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, this.timeout);
  }

  ngOnDestroy() {
    console.log("🔄 AnalyticsRemoteComponent destroyed");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onIframeLoad(): void {
    console.log("🔗 iframe loaded successfully");
    console.log("🔍 Debug - isLoading:", this.isLoading);
    console.log("🔍 Debug - loadError:", this.loadError);

    clearTimeout(this.timeoutId);
    this.isLoading = false;
    this.loadError = null;

    console.log("🔍 Debug - Before communication setup");
    this.setupCrossOriginCommunication();

    console.log("🔍 Debug - Skipping detectChanges temporarily");
    // this.cdr.detectChanges(); // TEMPORALMENTE DESHABILITADO

    console.log("🔍 Debug - onIframeLoad completed");
  }

  onIframeError(): void {
    console.error("❌ iframe error occurred");
    clearTimeout(this.timeoutId);
    this.loadError =
      "Failed to load analytics dashboard. Check if the service is running.";
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  retryLoading(): void {
    console.log("🔄 Retrying iframe load");
    this.loadError = null;
    this.isLoading = true;
    this.cdr.detectChanges();

    // Force iframe reload - use the raw URL string for setAttribute
    if (this.analyticsFrame?.nativeElement) {
      const rawUrl = "http://localhost:4201/analytics";
      this.renderer.setAttribute(
        this.analyticsFrame.nativeElement,
        "src",
        rawUrl,
      );
    }

    // Reset timeout
    this.timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.loadError = `Analytics dashboard couldn't load within ${this.timeout}ms (retry)`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, this.timeout);
  }

  private setupCrossOriginCommunication(): void {
    // Solo setup una vez para evitar múltiples listeners
    if (this.communicationSetup) {
      console.log("📡 Communication already setup - skipping");
      return;
    }

    this.communicationSetup = true;
    console.log("📡 Setting up cross-origin communication");

    // Setup postMessage communication for future features
    this.messageHandler = (event: MessageEvent) => {
      // Validate origin for security
      if (
        event.origin.includes(window.location.hostname) ||
        event.origin.includes("localhost:4201")
      ) {
        console.log("📨 Received message from analytics iframe:", event.data);

        // Handle different message types
        switch (event.data?.type) {
          case "analytics-ready":
            console.log("✅ Analytics iframe is ready");
            break;
          case "analytics-error":
            console.error(
              "❌ Analytics iframe reported error:",
              event.data.error,
            );
            break;
        }
      }
    };

    window.addEventListener("message", this.messageHandler);
  }
}
