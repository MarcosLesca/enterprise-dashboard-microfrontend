import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  template: `
    <div class="dashboard-home">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {{ currentUser?.name || 'User' }}!</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>1,234</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>$45,678</h3>
            <p>Revenue</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>+23%</h3>
            <p>Growth</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <h3>2.3s</h3>
            <p>Avg. Response</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/dashboard/analytics" class="action-card">
            <div class="action-icon">📈</div>
            <h3>Analytics</h3>
            <p>View detailed analytics and reports</p>
            <span class="action-badge">React</span>
          </a>
          
          <a routerLink="/dashboard/profile" class="action-card">
            <div class="action-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your account settings</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent {
  currentUser = { name: "User" }; // This would come from auth service
}