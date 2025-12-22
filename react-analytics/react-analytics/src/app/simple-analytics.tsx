import { useState, useEffect } from "react";
import { Download, Users, Eye, Clock, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import DataTable from "../components/DataTable";
import "./analytics-dashboard.css";

const SimpleAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  // Animación de entrada al montar el componente
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Stats data ENTERPRISE con más contexto y trends
  const statsData = [
    {
      title: "Total Visitors",
      value: "18.2K",
      previousValue: "16.2K",
      change: "+12.5%",
      icon: Users,
      color: "#3b82f6",
      trend: "up" as const,
      subtitle: "Unique visitors",
      description: "Total number of unique visitors to your platform",
      progress: 75,
      target: "24K",
      format: "number" as const,
    },
    {
      title: "Page Views",
      value: "28.4K",
      previousValue: "26.3K",
      change: "+8.2%",
      icon: Eye,
      color: "#10b981",
      trend: "up" as const,
      subtitle: "Total page impressions",
      description: "Total number of page views across all pages",
      progress: 82,
      target: "35K",
      format: "number" as const,
    },
    {
      title: "Avg. Session",
      value: "3m 42s",
      previousValue: "3m 33s",
      change: "+5.1%",
      icon: Clock,
      color: "#f59e0b",
      trend: "up" as const,
      subtitle: "Time on site",
      description: "Average time users spend on your platform",
      progress: 68,
      target: "4m",
      format: "time" as const,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      previousValue: "3.6%",
      change: "-0.4%",
      icon: TrendingUp,
      color: "#ef4444",
      trend: "down" as const,
      subtitle: "Goal completion",
      description: "Percentage of users who complete desired actions",
      progress: 45,
      target: "5%",
      format: "percentage" as const,
    },
  ];

  // Chart data mejor estructurado
  const trafficData = [
    { name: "Mon", value: 4000, label: "4.0K" },
    { name: "Tue", value: 3000, label: "3.0K" },
    { name: "Wed", value: 3500, label: "3.5K" },
    { name: "Thu", value: 2780, label: "2.8K" },
    { name: "Fri", value: 1890, label: "1.9K" },
    { name: "Sat", value: 2390, label: "2.4K" },
    { name: "Sun", value: 3490, label: "3.5K" },
  ];

  // Table data
  const topPagesData = [
    { page: "/dashboard", visitors: "8,421", conversion: "3.2%" },
    { page: "/analytics", visitors: "6,234", conversion: "2.8%" },
    { page: "/reports", visitors: "4,892", conversion: "4.1%" },
    { page: "/settings", visitors: "3,156", conversion: "1.9%" },
    { page: "/profile", visitors: "2,847", conversion: "0.8%" },
  ];

  // Simular carga de datos cuando cambia el timeRange
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simular network delay

    return () => clearTimeout(timer);
  }, [timeRange]);

  const handleExport = () => {
    // Simular exportación
    console.log("Exporting analytics data...");
    alert("📊 Analytics report would be downloaded in production");
  };

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
        </div>
        <div className="analytics-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
            disabled={isLoading}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            className="export-button"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </header>

      {/* Stats Cards Grid */}
      <section className="stats-grid">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            loading={isLoading}
          />
        ))}
      </section>

      {/* Charts Grid */}
      <section className="charts-grid">
        <SimpleBarChart
          data={trafficData}
          title="Traffic Overview"
          height={200}
          color="#3b82f6"
          loading={isLoading}
        />

        <DataTable data={topPagesData} title="Top Pages" loading={isLoading} />
      </section>
    </div>
  );
};

export default SimpleAnalytics;
