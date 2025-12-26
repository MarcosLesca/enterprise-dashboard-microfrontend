import { LucideIcon } from "lucide-react";

// Dashboard Stats Types
export interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

// Chart Data Types
export interface LineChartData {
  name: string;
  visitors: number;
}

export interface PieData {
  name: string;
  value: number;
  fill: string;
  [key: string]: any; // Compatible con Recharts
}

// Table Data Types
export interface TopPageData {
  page: string;
  visitors: string;
  bounceRate: string;
}

// Time Range Options
export type TimeRange = "24h" | "7d" | "30d";

// Theme Types
export type Theme = "light" | "dark";

// Export Report Data
export interface ExportReportData {
  stats: StatCard[];
  timeRange: TimeRange;
}
