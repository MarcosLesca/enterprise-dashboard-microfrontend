import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Moon,
  Sun,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  trend: "up" | "down";
}

interface LineChartData {
  name: string;
  visitors: number;
}

interface PieData {
  name: string;
  value: number;
  fill: string;
}

interface PieData {
  name: string;
  value: number;
  fill: string;
}

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isDark, setIsDark] = useState(false);

  // Mock data
  const stats: StatCard[] = [
    {
      title: "Total Visitors",
      value: "18.2K",
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Page Views",
      value: "28.4K",
      change: "+8.2%",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Avg. Duration",
      value: "4:32",
      change: "+18.3%",
      icon: BarChart3,
      trend: "up",
    },
    {
      title: "Bounce Rate",
      value: "32.8%",
      change: "-5.1%",
      icon: PieChartIcon,
      trend: "down",
    },
  ];

  const trafficData: LineChartData[] = [
    { name: "Mon", visitors: 4000 },
    { name: "Tue", visitors: 3000 },
    { name: "Wed", visitors: 2000 },
    { name: "Thu", visitors: 2780 },
    { name: "Fri", visitors: 1890 },
    { name: "Sat", visitors: 2390 },
    { name: "Sun", visitors: 3490 },
  ];

  const deviceData = [
    { name: "Desktop", value: 45, fill: "#3b82f6" },
    { name: "Mobile", value: 35, fill: "#10b981" },
    { name: "Tablet", value: 20, fill: "#f59e0b" },
  ];

  const topPages = [
    { page: "/dashboard", visitors: "8,421", bounceRate: "32.5%" },
    { page: "/analytics", visitors: "6,234", bounceRate: "28.3%" },
    { page: "/reports", visitors: "4,892", bounceRate: "35.1%" },
    { page: "/settings", visitors: "2,156", bounceRate: "22.8%" },
  ];

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const exportReport = () => {
    // Mock export functionality
    const dataStr = JSON.stringify({ stats, timeRange }, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-report-${timeRange}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
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
                onChange={(e) => setTimeRange(e.target.value)}
                className="input text-sm"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>

              {/* Export Button */}
              <button
                onClick={exportReport}
                className="btn btn-secondary btn-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      stat.trend === "up"
                        ? "text-success-600"
                        : "text-error-600 rotate-180"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-success-600"
                        : "text-error-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    from last month
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Chart */}
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
                <LineChart data={trafficData}>
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

          {/* Device Distribution */}
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
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
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
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center gap-2">
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
        </div>

        {/* Top Pages Table */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Top Pages
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Most visited pages and performance metrics
            </p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[40%]">Page</th>
                  <th className="w-[30%]">Visitors</th>
                  <th className="w-[30%]">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {page.page}
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      {page.visitors}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          parseFloat(page.bounceRate) < 30
                            ? "badge-success"
                            : parseFloat(page.bounceRate) < 40
                              ? "badge-warning"
                              : "badge-error"
                        }`}
                      >
                        {page.bounceRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
