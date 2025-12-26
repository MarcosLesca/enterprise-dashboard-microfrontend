// ===================================
// ANALYTICS TYPES - ENTERPRISE GRADE
// ===================================

export type TrendDirection = "up" | "down" | "neutral";

export type StatFormat = "number" | "percentage" | "time" | "currency";

export interface BaseMetric {
  title: string;
  value: string;
  previousValue?: string;
  change: string;
  trend: TrendDirection;
  format: StatFormat;
}

export interface StatCardData extends BaseMetric {
  subtitle?: string;
  description?: string;
  progress?: number; // 0-100
  target?: string;
}

export interface TrafficDataPoint {
  name: string;
  value: number;
  label: string;
}

export interface PageData {
  page: string;
  visitors: string;
  conversion: string;
}

export interface AnalyticsFilters {
  timeRange: TimeRange;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type TimeRange = "24h" | "7d" | "30d" | "90d" | "custom";

export interface AnalyticsData {
  stats: StatCardData[];
  traffic: TrafficDataPoint[];
  topPages: PageData[];
  lastUpdated: Date;
  isLoading: boolean;
  error?: string;
}

export interface AnalyticsHookReturn {
  data: AnalyticsData | null;
  filters: AnalyticsFilters;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  refetch: () => Promise<void>;
  exportReport: (format?: "csv" | "pdf" | "json") => Promise<void>;
}

export interface StatCardConfig {
  showProgress?: boolean;
  showActions?: boolean;
  mobileOptimized?: boolean;
  animateOnMount?: boolean;
}

export interface DashboardLayoutProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export interface ChartData {
  [key: string]: unknown;
}

export interface AnalyticsGridProps {
  stats: StatCardData[];
  charts: Array<{
    id: string;
    title: string;
    component: React.ComponentType<ChartData>;
    data: ChartData;
  }>;
  loading?: boolean;
}

export interface ExportOptions {
  format: "csv" | "pdf" | "json";
  includeCharts?: boolean;
  dateRange?: TimeRange;
  metrics?: string[];
}

// Component Props Interfaces
export interface SimpleAnalyticsProps {
  initialFilters?: Partial<AnalyticsFilters>;
  config?: StatCardConfig;
  onDataUpdate?: (data: AnalyticsData) => void;
  onError?: (error: Error) => void;
}

import { LucideIcon } from "lucide-react";

export interface StatCardProps extends StatCardData {
  icon: LucideIcon;
  color: string;
  loading?: boolean;
  config?: StatCardConfig;
  onClick?: () => void;
  onExport?: () => void;
  onConfigure?: () => void;
}

export interface SimpleBarChartProps {
  data: TrafficDataPoint[];
  title: string;
  height?: number;
  color?: string;
  loading?: boolean;
  onClick?: (dataPoint: TrafficDataPoint) => void;
}

export interface DataTableProps {
  data: PageData[];
  title: string;
  loading?: boolean;
  onRowClick?: (page: PageData) => void;
  sortable?: boolean;
  searchable?: boolean;
}
