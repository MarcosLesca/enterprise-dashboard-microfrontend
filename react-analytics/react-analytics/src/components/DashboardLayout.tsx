import React from "react";
import { Download, RefreshCw } from "lucide-react";
import type { TimeRange, DashboardLayoutProps } from "../types/analytics";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  loading = false,
  error,
  onRetry,
}) => {
  const renderContent = () => {
    if (error) {
      return (
        <div className="analytics-dashboard__error">
          <h2>⚠️ Error Loading Data</h2>
          <p>{error}</p>
          {onRetry && (
            <button type="button" className="export-button" onClick={onRetry}>
              <RefreshCw size={16} />
              Retry
            </button>
          )}
        </div>
      );
    }

    if (loading && !children) {
      return (
        <div className="analytics-dashboard__loading">
          <div className="analytics-dashboard__spinner" />
          <p>Loading analytics data...</p>
        </div>
      );
    }

    return children;
  };

  return <div className="analytics-dashboard">{renderContent()}</div>;
};

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading?: boolean;
  lastUpdated?: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onExport,
  isLoading = false,
  lastUpdated,
}) => {
  return (
    <header className="analytics-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="analytics-subtitle">{subtitle}</p>}
        {lastUpdated && (
          <small className="analytics-timestamp">
            Last updated: {lastUpdated.toLocaleString()}
          </small>
        )}
      </div>

      <div className="analytics-controls">
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          className="time-range-select"
          disabled={isLoading}
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>

        <button
          type="button"
          className="export-button"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh data (Ctrl/Cmd + R)"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>

        <button
          type="button"
          className="export-button"
          onClick={onExport}
          disabled={isLoading}
          title="Export report (Ctrl/Cmd + E)"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>
    </header>
  );
};

export { DashboardHeader };
export default DashboardLayout;
