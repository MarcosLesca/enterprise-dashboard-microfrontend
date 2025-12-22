import React from "react";
import { Activity } from "lucide-react";

interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
}

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  color?: string;
  loading?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title = "Traffic Overview",
  height = 200,
  color = "#3b82f6",
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">{title}</h3>
          <Activity size={20} />
        </div>
        <div className="chart-card__loading">
          <div className="chart-skeleton"></div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
        <Activity size={20} className="text-gray-400" />
      </div>
      <div className="simple-chart" style={{ height: `${height}px` }}>
        <div className="simple-chart__bars">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div key={index} className="chart-bar">
                <div
                  className="chart-bar__fill"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: color,
                  }}
                  title={`${item.name}: ${item.label || item.value}`}
                ></div>
                <div className="chart-bar__value">
                  {item.label || item.value}
                </div>
                <div className="chart-bar__label">{item.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimpleBarChart;
