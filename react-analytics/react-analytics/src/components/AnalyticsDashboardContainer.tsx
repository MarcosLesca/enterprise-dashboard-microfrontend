import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import StatCard from "./StatCard";
import { TrafficChart } from "./TrafficChart";
import { DeviceChart } from "./DeviceChart";
import { TopPagesTable } from "./TopPagesTable";
import { useTheme } from "../hooks/useTheme";
import { useExportReport } from "../hooks/useExportReport";
import {
  mockStatsData,
  mockTrafficData,
  mockDeviceData,
  mockTopPages,
} from "../app/services/mockData";
import { TimeRange, StatCard as StatCardType } from "../app/types";
import styles from "./AnalyticsDashboard.module.css";
import gridStyles from "./Grids.module.css";

export const AnalyticsDashboardContainer = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const { theme, toggleTheme } = useTheme();
  const { exportReport } = useExportReport(timeRange);

  const handleExport = () => {
    exportReport(mockStatsData);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`${styles["dashboard"]} ${
        isDark ? styles["dashboard--dark"] : ""
      }`}
    >
      {/* Header */}
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onExportReport={handleExport}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className={gridStyles["statsGrid"]}>
          {mockStatsData.map((stat: StatCardType) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color="#3b82f6"
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className={gridStyles["chartsGrid"]}>
          <TrafficChart data={mockTrafficData} isDark={isDark} />
          <DeviceChart data={mockDeviceData} isDark={isDark} />
        </div>

        {/* Top Pages Table */}
        <TopPagesTable data={mockTopPages} />
      </div>
    </div>
  );
};
