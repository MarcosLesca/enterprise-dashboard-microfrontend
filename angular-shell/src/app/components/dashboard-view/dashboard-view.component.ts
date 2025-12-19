import { Component, OnInit } from '@angular/core';
import { ApiService, Dashboard, Widget } from '../services/api.service';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Enterprise Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.email }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>
      
      <div class="dashboard-tabs">
        <button 
          *ngFor="let dashboard of dashboards" 
          (click)="selectDashboard(dashboard)"
          [class.active]="selectedDashboard?.id === dashboard.id"
          class="tab-btn">
          {{ dashboard.name }}
        </button>
        <button (click)="createNewDashboard()" class="tab-btn add-btn">+ New</button>
      </div>
      
      <div class="dashboard-content" *ngIf="selectedDashboard">
        <h2>{{ selectedDashboard.name }}</h2>
        <p>{{ selectedDashboard.description }}</p>
        
        <div class="widgets-grid">
          <div 
            *ngFor="let widget of widgets" 
            class="widget-container"
            [style.gridColumn]="widget.position_x + 1 + ' / span ' + widget.width"
            [style.gridRow]="widget.position_y + 1 + ' / span ' + widget.height">
            <div class="widget">
              <h3>{{ widget.name }}</h3>
              <div class="widget-content">
                <!-- Chart Widget -->
                <div *ngIf="widget.widget_type === 'chart'" class="chart-placeholder">
                  📊 Chart: {{ widget.config.type }}
                  <div class="chart-data">{{ widget.config.data | json }}</div>
                </div>
                
                <!-- Metric Widget -->
                <div *ngIf="widget.widget_type === 'metric'" class="metric-widget">
                  <div class="metric-value">{{ widget.config.value }}</div>
                  <div class="metric-trend">{{ widget.config.trend }}</div>
                </div>
                
                <!-- Table Widget -->
                <div *ngIf="widget.widget_type === 'table'" class="table-widget">
                  📋 Table Data
                </div>
                
                <!-- Text Widget -->
                <div *ngIf="widget.widget_type === 'text'" class="text-widget">
                  📝 Text Content
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- React Analytics Module -->
        <div class="analytics-section">
          <h3>📈 Advanced Analytics</h3>
          <div id="react-analytics-container">
            <!-- React Analytics micro-frontend will be loaded here -->
            <iframe 
              src="http://localhost:4201" 
              frameborder="0" 
              class="analytics-frame"
              title="React Analytics">
            </iframe>
          </div>
        </div>
      </div>
      
      <div class="empty-state" *ngIf="!selectedDashboard && dashboards.length === 0">
        <h2>No dashboards yet</h2>
        <p>Create your first dashboard to get started!</p>
        <button (click)="createNewDashboard()" class="primary-btn">Create Dashboard</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .dashboard-header h1 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logout-btn {
      background: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .dashboard-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }
    
    .tab-btn {
      background: none;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px 4px 0 0;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .tab-btn:hover {
      background: #f5f5f5;
    }
    
    .tab-btn.active {
      background: #2196f3;
      color: white;
    }
    
    .tab-btn.add-btn {
      background: #4caf50;
      color: white;
      border-radius: 4px;
    }
    
    .widgets-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 15px;
      margin-bottom: 40px;
      min-height: 300px;
    }
    
    .widget-container {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .widget {
      padding: 15px;
      height: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .widget h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 10px;
    }
    
    .chart-placeholder {
      text-align: center;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .metric-widget {
      text-align: center;
      padding: 20px;
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #2196f3;
      margin-bottom: 5px;
    }
    
    .metric-trend {
      font-size: 14px;
      color: #4caf50;
    }
    
    .table-widget, .text-widget {
      padding: 20px;
      text-align: center;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .analytics-section {
      margin-top: 40px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .analytics-frame {
      width: 100%;
      height: 400px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    
    .empty-state h2 {
      color: #666;
      margin-bottom: 10px;
    }
    
    .empty-state p {
      color: #999;
      margin-bottom: 20px;
    }
    
    .primary-btn {
      background: #2196f3;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
  `]
})
export class DashboardViewComponent implements OnInit {
  dashboards: Dashboard[] = [];
  selectedDashboard: Dashboard | null = null;
  widgets: Widget[] = [];
  currentUser: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadDashboards();
  }

  loadUserProfile(): void {
    this.apiService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Redirect to login if not authenticated
        if (error.status === 401) {
          window.location.href = '/auth/login';
        }
      }
    });
  }

  loadDashboards(): void {
    this.apiService.getDashboards().subscribe({
      next: (dashboards) => {
        this.dashboards = dashboards;
        if (dashboards.length > 0 && !this.selectedDashboard) {
          this.selectDashboard(dashboards[0]);
        }
      },
      error: (error) => {
        console.error('Error loading dashboards:', error);
      }
    });
  }

  selectDashboard(dashboard: Dashboard): void {
    this.selectedDashboard = dashboard;
    this.loadDashboardWidgets(dashboard.id);
  }

  loadDashboardWidgets(dashboardId: number): void {
    this.apiService.getDashboardWidgets(dashboardId).subscribe({
      next: (widgets) => {
        this.widgets = widgets;
      },
      error: (error) => {
        console.error('Error loading widgets:', error);
      }
    });
  }

  createNewDashboard(): void {
    const name = prompt('Enter dashboard name:');
    if (name) {
      const description = prompt('Enter dashboard description:');
      
      this.apiService.createDashboard({
        name,
        description: description || ''
      }).subscribe({
        next: (dashboard) => {
          this.dashboards.push(dashboard);
          this.selectDashboard(dashboard);
        },
        error: (error) => {
          console.error('Error creating dashboard:', error);
        }
      });
    }
  }

  logout(): void {
    this.apiService.logout();
    window.location.href = '/auth/login';
  }
}