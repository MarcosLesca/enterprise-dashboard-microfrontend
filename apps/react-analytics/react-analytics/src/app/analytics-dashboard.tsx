import React, { useState } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import './analytics-dashboard.css';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data
  const stats = [
    {
      title: 'Total Visitors',
      value: '18.2K',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Page Views',
      value: '28.4K',
      change: '+8.2%',
      icon: Activity,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics Dashboard</h1>
        <p className="analytics-subtitle">Real-time analytics - React Micro-frontend</p>
        <div className="analytics-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
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
                <div className="stat-icon">
                  <IconComponent />
                </div>
              </div>
              <div className="stat-change">
                <TrendingUp className="trend-up" />
                <span className="trend-up">{stat.change}</span>
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
            <BarChart3 />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: 'Mon', visitors: 4000 },
                { name: 'Tue', visitors: 3000 },
                { name: 'Wed', visitors: 2000 },
                { name: 'Thu', visitors: 2780 },
                { name: 'Fri', visitors: 1890 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Device Distribution</h3>
            <PieChartIcon />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Desktop', value: 45, fill: '#3b82f6' },
                    { name: 'Mobile', value: 35, fill: '#10b981' },
                    { name: 'Tablet', value: 20, fill: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Top Pages</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Visitors</th>
              <th>Bounce Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/dashboard</td>
              <td>8,421</td>
              <td>32.5%</td>
            </tr>
            <tr>
              <td>/analytics</td>
              <td>6,234</td>
              <td>28.3%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;