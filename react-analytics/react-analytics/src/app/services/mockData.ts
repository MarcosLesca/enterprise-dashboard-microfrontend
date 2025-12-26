import { StatCard, LineChartData, PieData, TopPageData } from "../types";
import {
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

export const mockStatsData: StatCard[] = [
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

export const mockTrafficData: LineChartData[] = [
  { name: "Mon", visitors: 4000 },
  { name: "Tue", visitors: 3000 },
  { name: "Wed", visitors: 2000 },
  { name: "Thu", visitors: 2780 },
  { name: "Fri", visitors: 1890 },
  { name: "Sat", visitors: 2390 },
  { name: "Sun", visitors: 3490 },
];

export const mockDeviceData: PieData[] = [
  { name: "Desktop", value: 45, fill: "#3b82f6" },
  { name: "Mobile", value: 35, fill: "#10b981" },
  { name: "Tablet", value: 20, fill: "#f59e0b" },
];

export const mockTopPages: TopPageData[] = [
  { page: "/dashboard", visitors: "8,421", bounceRate: "32.5%" },
  { page: "/analytics", visitors: "6,234", bounceRate: "28.3%" },
  { page: "/reports", visitors: "4,892", bounceRate: "35.1%" },
  { page: "/settings", visitors: "2,156", bounceRate: "22.8%" },
];
