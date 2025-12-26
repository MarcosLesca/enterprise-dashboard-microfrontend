import React from "react";
import SimpleBarChart from "./SimpleBarChart";
import DataTable from "./DataTable";

interface TrafficDataPoint {
  name: string;
  value: number;
  label: string;
}

interface PageData {
  page: string;
  visitors: string;
  conversion: string;
}

export interface ChartItem {
  id: string;
  title: string;
  type: "bar" | "table";
  data: TrafficDataPoint[] | PageData[];
  height?: number;
  color?: string;
}

export interface ChartsGridProps {
  charts: ChartItem[];
  loading?: boolean;
  columns?: 1 | 2 | "auto";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const ChartsGrid: React.FC<ChartsGridProps> = ({
  charts,
  loading = false,
  columns = "auto",
  gap = "md",
  className = "",
}) => {
  const gridClasses = {
    auto: "charts-grid-auto",
    1: "charts-grid-1",
    2: "charts-grid-2",
  };

  const gapClasses = {
    sm: "gap-sm",
    md: "gap-md",
    lg: "gap-lg",
  };

  const gridClassName =
    `charts-grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`.trim();

  if (loading && charts.length === 0) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 2 }).map((_, skeletonIdx) => (
          <div key={`skeleton-chart-${skeletonIdx}`} className="chart-card">
            <div className="chart-card__header">
              <div
                className="skeleton skeleton--text"
                style={{ width: "150px" }}
              />
            </div>
            <div className="chart-skeleton" style={{ height: "200px" }} />
          </div>
        ))}
      </div>
    );
  }

  const renderChart = (chart: ChartItem) => {
    const commonProps = {
      loading,
      title: chart.title,
    };

    switch (chart.type) {
      case "bar":
        return (
          <SimpleBarChart
            {...commonProps}
            data={chart.data as TrafficDataPoint[]}
            height={chart.height || 200}
            color={chart.color || "#3b82f6"}
          />
        );
      case "table":
        return <DataTable {...commonProps} data={chart.data as PageData[]} />;
      default:
        return null;
    }
  };

  return (
    <div className={gridClassName}>
      {charts.map((chart, chartIdx) => (
        <div key={`${chart.id}-${chartIdx}`} className="chart-card">
          {renderChart(chart)}
        </div>
      ))}
    </div>
  );
};

export default ChartsGrid;
