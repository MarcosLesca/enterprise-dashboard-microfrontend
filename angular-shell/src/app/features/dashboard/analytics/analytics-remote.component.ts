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
    <div class="analytics-page">
      <!-- TOP NAVIGATION -->
      <header class="analytics-header">
        <div class="header-left">
          <nav class="breadcrumb">
            <span class="breadcrumb-item">Dashboard</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">Analytics</span>
          </nav>
          <h1 class="page-title">Analytics Dashboard</h1>
          <p class="page-description">
            Real-time insights and performance metrics powered by React
            micro-frontend
          </p>
        </div>

        <div class="header-right">
          <div class="micro-frontend-badge">
            <span class="badge-icon">⚛️</span>
            <span class="badge-text">React</span>
          </div>

          <div
            class="connection-status"
            [class.connected]="isConnected"
            [class.loading]="isLoading"
          >
            <span class="status-dot"></span>
            <span class="status-text">{{ connectionStatusText }}</span>
          </div>

          <div class="header-actions">
            <button
              class="action-button secondary"
              (click)="refreshIframe()"
              [disabled]="isLoading"
            >
              <span class="button-icon">🔄</span>
              <span>Refresh</span>
            </button>

            <button class="action-button primary" (click)="openInNewTab()">
              <span class="button-icon">🔗</span>
              <span>Open in New Tab</span>
            </button>
          </div>
        </div>
      </header>

      <!-- MAIN CONTENT WITH IFRAME -->
      <main class="analytics-main">
        <div class="analytics-content">
          <!-- LOADING STATE -->
          <div *ngIf="isLoading" class="loading-container">
            <div class="loading-animation">
              <div class="loading-spinner"></div>
              <div class="loading-text">
                <h3>Loading Analytics Dashboard</h3>
                <p>Initializing React micro-frontend...</p>
                <div class="loading-progress">
                  <div
                    class="progress-bar"
                    [style.width.%]="loadingProgress"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- ERROR STATE -->
          <div *ngIf="loadError" class="error-container">
            <div class="error-animation">
              <div class="error-icon">⚠️</div>
              <div class="error-content">
                <h3>Analytics Unavailable</h3>
                <p>{{ loadError }}</p>
                <div class="error-actions">
                  <button class="retry-button" (click)="retryLoading()">
                    <span class="button-icon">🔄</span>
                    Try Again
                  </button>
                  <button class="debug-button" (click)="showDebugInfo()">
                    <span class="button-icon">🔍</span>
                    Debug Info
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- IFRAME CONTAINER -->
          <div
            class="iframe-container"
            [class.hidden]="isLoading || loadError"
            [class.loading]="isLoading"
          >
            <iframe
              #analyticsFrame
              [src]="iframeSrc"
              class="analytics-iframe"
              title="Analytics Dashboard - React Micro-frontend"
              frameborder="0"
              scrolling="auto"
              (load)="onIframeLoad()"
              (error)="onIframeError()"
            >
            </iframe>
          </div>
        </div>
      </main>

      <!-- FOOTER WITH INFO -->
      <footer class="analytics-footer">
        <div class="footer-left">
          <span class="footer-text"
            >Powered by React Analytics Micro-frontend</span
          >
          <span class="footer-separator">•</span>
          <span class="footer-text">v1.0.0</span>
        </div>

        <div class="footer-right">
          <span class="performance-metrics"> Load time: {{ loadTime }}ms </span>
          <span class="footer-separator">•</span>
          <span class="iframe-info"> Port: {{ iframePort }} </span>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      /* MAIN PAGE LAYOUT */
      .analytics-page {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 4rem);
        background: #f8fafc;
        overflow: hidden;
      }

      /* HEADER STYLES */
      .analytics-header {
        background: white;
        border-bottom: 1px solid #e2e8f0;
        padding: 1.5rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-shrink: 0;
      }

      .header-left {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #64748b;
      }

      .breadcrumb-item.active {
        color: #1e293b;
        font-weight: 600;
      }

      .breadcrumb-separator {
        color: #cbd5e1;
      }

      .page-title {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        line-height: 1.2;
      }

      .page-description {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
        max-width: 600px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .micro-frontend-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #dbeafe;
        color: #1e40af;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .connection-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        background: #fef2f2;
        color: #dc2626;
      }

      .connection-status.connected {
        background: #f0fdf4;
        color: #16a34a;
      }

      .connection-status.loading {
        background: #fefce8;
        color: #ca8a04;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .header-actions {
        display: flex;
        gap: 0.75rem;
      }

      .action-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .action-button.secondary {
        background: #f8fafc;
        color: #475569;
        border: 1px solid #e2e8f0;
      }

      .action-button.secondary:hover {
        background: #f1f5f9;
      }

      .action-button.primary {
        background: #3b82f6;
        color: white;
      }

      .action-button.primary:hover {
        background: #2563eb;
      }

      .action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* MAIN CONTENT */
      .analytics-main {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .analytics-content {
        flex: 1;
        position: relative;
        background: white;
        margin: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      /* LOADING STATE */
      .loading-container {
        position: absolute;
        inset: 0;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }

      .loading-animation {
        text-align: center;
        max-width: 400px;
      }

      .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #f1f5f9;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-text h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 0.5rem;
      }

      .loading-text p {
        color: #64748b;
        margin: 0 0 1rem;
      }

      .loading-progress {
        height: 6px;
        background: #f1f5f9;
        border-radius: 3px;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      /* ERROR STATE */
      .error-container {
        position: absolute;
        inset: 0;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }

      .error-animation {
        text-align: center;
        max-width: 400px;
      }

      .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .error-content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #dc2626;
        margin: 0 0 0.5rem;
      }

      .error-content p {
        color: #64748b;
        margin: 0 0 1.5rem;
        line-height: 1.5;
      }

      .error-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
      }

      .retry-button,
      .debug-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .retry-button {
        background: #3b82f6;
        color: white;
      }

      .retry-button:hover {
        background: #2563eb;
      }

      .debug-button {
        background: #f8fafc;
        color: #475569;
        border: 1px solid #e2e8f0;
      }

      .debug-button:hover {
        background: #f1f5f9;
      }

      /* IFRAME STYLES */
      .iframe-container {
        width: 100%;
        height: 100%;
        background: white;
        transition: opacity 0.3s ease;
      }

      .iframe-container.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .analytics-iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 0;
      }

      /* FOOTER */
      .analytics-footer {
        background: white;
        border-top: 1px solid #e2e8f0;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: #64748b;
        flex-shrink: 0;
      }

      .footer-left,
      .footer-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .footer-separator {
        color: #cbd5e1;
      }

      /* RESPONSIVE DESIGN */
      @media (max-width: 768px) {
        .analytics-header {
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .header-right {
          width: 100%;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .page-title {
          font-size: 1.5rem;
        }

        .analytics-content {
          margin: 1rem;
        }

        .header-actions {
          flex-direction: column;
          gap: 0.5rem;
        }

        .action-button {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
        }
      }

      @media (max-width: 480px) {
        .analytics-footer {
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }
      }
    `,
  ],
})
export class AnalyticsRemoteComponent implements OnInit, OnDestroy {
  @ViewChild("analyticsFrame") analyticsFrame!: ElementRef<HTMLIFrameElement>;

  @Input() analyticsUrl?: string;
  @Input() timeout: number = 8000;

  isLoading = true;
  loadError: string | null = null;
  isConnected = false;
  loadingProgress = 0;
  loadTime = 0;
  readonly iframePort = 4201;

  private timeoutId: any;
  private communicationSetup = false;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private cachedIframeSrc: SafeResourceUrl | null = null;
  private startTime: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private mfConfig: MicroFrontendConfigService,
    private sanitizer: DomSanitizer,
  ) {
    const url = "http://localhost:4201/analytics";
    this.cachedIframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get iframeSrc(): SafeResourceUrl {
    return this.cachedIframeSrc!;
  }

  get connectionStatusText(): string {
    if (this.isLoading) return "Connecting...";
    if (this.loadError) return "Connection Failed";
    if (this.isConnected) return "Connected";
    return "Disconnected";
  }

  ngOnInit() {
    console.log("🚀 AnalyticsRemoteComponent initialized");
    console.log("🔗 iframe src:", this.iframeSrc);
    this.startTime = Date.now();

    this.simulateLoadingProgress();

    this.timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.log("⏰ Loading timeout reached, showing error");
        this.loadError = `Analytics dashboard couldn't load within ${this.timeout}ms`;
        this.isLoading = false;
        this.loadingProgress = 0;
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

  // NEW METHODS FOR ENHANCED FUNCTIONALITY
  simulateLoadingProgress(): void {
    const progressInterval = setInterval(() => {
      if (this.isLoading && this.loadingProgress < 90) {
        this.loadingProgress += Math.random() * 15;
        this.cdr.detectChanges();
      } else if (!this.isLoading) {
        clearInterval(progressInterval);
      }
    }, 200);

    setTimeout(() => clearInterval(progressInterval), 5000);
  }

  refreshIframe(): void {
    console.log("🔄 Manual iframe refresh requested");
    this.retryLoading();
  }

  openInNewTab(): void {
    window.open("http://localhost:4201/analytics", "_blank");
  }

  showDebugInfo(): void {
    const debugInfo = {
      url: this.iframeSrc,
      loading: this.isLoading,
      error: this.loadError,
      connected: this.isConnected,
      loadTime: this.loadTime,
      timestamp: new Date().toISOString(),
    };

    console.log("🔍 Debug Info:", debugInfo);
    alert(`Debug Info (check console):\n${JSON.stringify(debugInfo, null, 2)}`);
  }

  retryLoading(): void {
    console.log("🔄 Retrying iframe load");
    this.loadError = null;
    this.isLoading = true;
    this.loadingProgress = 0;
    this.isConnected = false;
    this.startTime = Date.now();
    this.cdr.detectChanges();

    if (this.analyticsFrame?.nativeElement) {
      const rawUrl = "http://localhost:4201/analytics";
      this.renderer.setAttribute(
        this.analyticsFrame.nativeElement,
        "src",
        rawUrl,
      );
    }

    this.timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.loadError = `Analytics dashboard couldn't load within ${this.timeout}ms (retry)`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, this.timeout);
  }

  onIframeLoad(): void {
    console.log("🔗 iframe loaded successfully");
    clearTimeout(this.timeoutId);

    this.isLoading = false;
    this.isConnected = true;
    this.loadingProgress = 100;
    this.loadTime = Date.now() - this.startTime;

    this.setupCrossOriginCommunication();
    this.cdr.detectChanges();
  }

  onIframeError(): void {
    console.error("❌ iframe error occurred");
    clearTimeout(this.timeoutId);
    this.isConnected = false;
    this.loadError =
      "Failed to load analytics dashboard. Check if the service is running.";
    this.isLoading = false;
    this.loadingProgress = 0;
    this.cdr.detectChanges();
  }

  private setupCrossOriginCommunication(): void {
    if (this.communicationSetup) {
      console.log("📡 Communication already setup - skipping");
      return;
    }

    this.communicationSetup = true;
    console.log("📡 Setting up cross-origin communication");

    this.messageHandler = (event: MessageEvent) => {
      if (
        event.origin.includes(window.location.hostname) ||
        event.origin.includes("localhost:4201")
      ) {
        console.log("📨 Received message from analytics iframe:", event.data);

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
