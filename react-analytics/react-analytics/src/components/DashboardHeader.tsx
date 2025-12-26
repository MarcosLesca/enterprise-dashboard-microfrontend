import { Download } from "lucide-react";
import { TimeRange } from "../app/types";

interface DashboardHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onExportReport: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const DashboardHeader = ({
  timeRange,
  onTimeRangeChange,
  onExportReport,
  isDark,
  onThemeToggle,
}: DashboardHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time analytics - React Micro-frontend
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
              className="input text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>

            {/* Export Button */}
            <button
              onClick={onExportReport}
              type="button"
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              type="button"
              className="btn btn-ghost btn-sm"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <div className="w-4 h-4">☀️</div>
              ) : (
                <div className="w-4 h-4">🌙</div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
