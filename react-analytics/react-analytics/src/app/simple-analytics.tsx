import React, { useCallback, useMemo, useEffect, useState } from "react";
import {
  Download,
  Users,
  Eye,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import DataTable from "../components/DataTable";
import {
  useAnalyticsData,
  useAnalyticsKeyboardShortcuts,
} from "../hooks/useAnalyticsData";
import type {
  SimpleAnalyticsProps,
  TimeRange,
  StatCardProps,
  StatCardData,
} from "../types/analytics";

import "./analytics-dashboard.css";

// Icon mapping for stat cards
const ICON_MAP = {
  "Total Visitors": Users,
  "Page Views": Eye,
  "Avg. Session": Clock,
  "Conversion Rate": TrendingUp,
} as const;

// Color mapping for consistent theming
const COLOR_MAP = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
} as const;

const SimpleAnalytics: React.FC<SimpleAnalyticsProps> = ({
  initialFilters,
  config,
  onDataUpdate,
  onError,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Use our custom hook for data management
  const { data, filters, setFilters, refetch, exportReport } =
    useAnalyticsData(initialFilters);

  // Entrance animation
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Notify parent of data updates
  useEffect(() => {
    if (data && onDataUpdate) {
      onDataUpdate(data);
    }
  }, [data, onDataUpdate]);

  // Error handling
  useEffect(() => {
    if (data?.error && onError) {
      onError(new Error(data.error));
    }
  }, [data?.error, onError]);

  // Keyboard shortcuts
  useAnalyticsKeyboardShortcuts({
    onExport: () => handleExport(),
    onRefresh: refetch,
    onTimeRangeChange: (range: TimeRange) => handleTimeRangeChange(range),
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleTimeRangeChange = useCallback(
    (range: TimeRange) => {
      setFilters({ timeRange: range });
    },
    [setFilters],
  );

  const handleExport = useCallback(async () => {
    try {
      await exportReport("csv");
    } catch (error) {
      console.error("Export failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [exportReport, onError]);

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [refetch, onError]);

  // Memoized stat cards data with proper typing
  const statCardsData = useMemo((): StatCardProps[] | null => {
    if (!data) return null;

    return data.stats.map((stat: StatCardData) => ({
      title: stat.title,
      value: stat.value,
      previousValue: stat.previousValue,
      change: stat.change,
      icon: ICON_MAP[stat.title as keyof typeof ICON_MAP] || Users,
      color:
        stat.title === "Total Visitors"
          ? COLOR_MAP.blue
          : stat.title === "Page Views"
            ? COLOR_MAP.green
            : stat.title === "Avg. Session"
              ? COLOR_MAP.amber
              : COLOR_MAP.red,
      trend: stat.trend,
      format: stat.format,
      subtitle: stat.subtitle,
      description: stat.description,
      progress: stat.progress,
      target: stat.target,
      loading: data.isLoading,
      config: config,
    }));
  }, [data, config]);

  // Loading state
  if (!data) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-dashboard__loading">
          <div className="analytics-dashboard__spinner" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (data.error) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-dashboard__error">
          <h2>⚠️ Error Loading Data</h2>
          <p>{data.error}</p>
          <button
            type="button"
            className="export-button"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`analytics-dashboard ${
        isAnimated ? "analytics-dashboard--animated" : ""
      }`}
    >
      {/* Header Section */}
      <header className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="analytics-subtitle">
            Real-time insights and performance metrics
          </p>
          <small className="analytics-timestamp">
            Last updated: {data.lastUpdated.toLocaleString()}
          </small>
        </div>

        <div className="analytics-controls">
          <select
            value={filters.timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
            className="time-range-select"
            disabled={data.isLoading}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            type="button"
            className="export-button"
            onClick={handleRefresh}
            disabled={data.isLoading}
            title="Refresh data (Ctrl/Cmd + R)"
          >
            <RefreshCw
              size={16}
              className={data.isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            className="export-button"
            onClick={handleExport}
            disabled={data.isLoading}
            title="Export report (Ctrl/Cmd + E)"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </header>

      {/* Stats Cards Grid */}
      <section className="stats-grid">
        {statCardsData?.map((statProps) => (
          <StatCard key={`stat-${statProps.title}`} {...statProps} />
        ))}
      </section>

      {/* Charts Grid */}
      <section className="charts-grid">
        <SimpleBarChart
          data={data.traffic}
          title="Traffic Overview"
          height={200}
          color="#3b82f6"
          loading={data.isLoading}
        />

        <DataTable
          data={data.topPages}
          title="Top Pages"
          loading={data.isLoading}
        />
      </section>
    </div>
  );
};

export default SimpleAnalytics;
