import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { LineChartData } from "../app/types";
import { BarChart3 } from "lucide-react";

interface TrafficChartProps {
  data: LineChartData[];
  isDark: boolean;
}

export const TrafficChart = ({ data, isDark }: TrafficChartProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Traffic Overview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Visitor trends over time
          </p>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#9ca3af" : "#6b7280"}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke={isDark ? "#9ca3af" : "#6b7280"}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
