import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-remote',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-remote-container">
      <iframe 
        src="http://localhost:4201" 
        title="Analytics Dashboard"
        frameborder="0"
        scrolling="auto">
      </iframe>
    </div>
  `,
  styles: [`
    .analytics-remote-container {
      width: 100%;
      height: calc(100vh - 4rem); /* Account for navbar */
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .analytics-remote-container iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 0.5rem;
    }
  `]
})
export class AnalyticsRemoteComponent implements OnInit, OnDestroy {
  
  constructor() {
    console.log('AnalyticsRemoteComponent loaded');
  }

  ngOnInit() {
    console.log('AnalyticsRemoteComponent initialized');
    // Aquí podríamos agregar comunicación con el micro-frontend
  }

  ngOnDestroy() {
    console.log('AnalyticsRemoteComponent destroyed');
  }
}