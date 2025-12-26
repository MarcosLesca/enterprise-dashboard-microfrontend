import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { PieData } from "../app/types";
import { PieChart as PieChartIcon } from "lucide-react";

interface DeviceChartProps {
  data: PieData[];
  isDark: boolean;
}

export const DeviceChart = ({ data, isDark }: DeviceChartProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Device Distribution
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Traffic by device type
          </p>
        </div>
        <PieChartIcon className="w-5 h-5 text-gray-400" />
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`device-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Device Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {data.map((device, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: device.fill }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {device.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
