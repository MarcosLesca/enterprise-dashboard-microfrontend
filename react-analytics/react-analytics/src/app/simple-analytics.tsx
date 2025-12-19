import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TrendingUp, Users, Activity } from 'lucide-react';
import './analytics-dashboard.css';

const SimpleAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    {
      title: 'Total Visitors',
      value: '18.2K',
      change: '+12.5%',
      icon: Users,
      color: '#3b82f6'
    },
    {
      title: 'Page Views',
      value: '28.4K',
      change: '+8.2%',
      icon: Activity,
      color: '#10b981'
    },
    {
      title: 'Avg. Session',
      value: '3m 42s',
      change: '+5.1%',
      icon: TrendingUp,
      color: '#f59e0b'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+2.4%',
      icon: TrendingUp,
      color: '#22c55e'
    }
  ];

  const mockData = [
    { name: 'Mon', visitors: 4000, views: 12000 },
    { name: 'Tue', visitors: 3000, views: 9800 },
    { name: 'Wed', visitors: 3500, views: 14000 },
    { name: 'Thu', visitors: 2780, views: 11000 },
    { name: 'Fri', visitors: 1890, views: 8500 },
    { name: 'Sat', visitors: 2390, views: 7200 },
    { name: 'Sun', visitors: 3490, views: 9800 }
  ];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">Analytics Dashboard</h1>
          <p className="analytics-subtitle">React Micro-frontend with real-time analytics</p>
        </div>
        <div className="analytics-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="export-button">
            Export Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className="stat-icon" style={{ color: stat.color }}>
                  <IconComponent size={24} />
                </div>
              </div>
              <div className="stat-change">
                <TrendingUp size={16} />
                <span>{stat.change}</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Traffic Overview</h3>
            <Activity size={20} />
          </div>
          <div className="simple-chart">
            {mockData.map((item, index) => (
              <div key={index} className="chart-bar">
                <div className="chart-bar-fill" style={{ height: `${(item.visitors / 4000) * 100}%` }}></div>
                <div className="chart-bar-label">{item.visitors}</div>
                <div className="chart-day">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top Pages</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Visitors</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>/dashboard</td>
                <td>8,421</td>
                <td>3.2%</td>
              </tr>
              <tr>
                <td>/analytics</td>
                <td>6,234</td>
                <td>2.8%</td>
              </tr>
              <tr>
                <td>/reports</td>
                <td>4,892</td>
                <td>4.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SimpleAnalytics;