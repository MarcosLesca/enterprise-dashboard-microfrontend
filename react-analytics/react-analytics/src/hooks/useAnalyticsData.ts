import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AnalyticsData,
  AnalyticsFilters,
  TimeRange,
  StatCardData,
  TrafficDataPoint,
  PageData,
  AnalyticsHookReturn,
  ExportOptions,
} from "../types/analytics";

// ===================================
// MOCK DATA SERVICE
// ===================================
class AnalyticsDataService {
  private cache = new Map<string, AnalyticsData>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async fetchData(filters: AnalyticsFilters): Promise<AnalyticsData> {
    const cacheKey = JSON.stringify(filters);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.lastUpdated.getTime() < this.CACHE_TTL) {
      return cached;
    }

    // Simulate API delay (in real implementation, this would be fetch/axios)
    await this.delay(Math.random() * 500 + 300); // 300-800ms realistic delay

    const data = this.generateMockData(filters);
    this.cache.set(cacheKey, data);

    return data;
  }

  async exportData(options: ExportOptions): Promise<Blob> {
    await this.delay(1000); // Simulate export processing

    // In real implementation, this would call actual export API
    const mockData = {
      format: options.format,
      timestamp: new Date().toISOString(),
      data: "mock export data",
    };

    return new Blob([JSON.stringify(mockData, null, 2)], {
      type:
        options.format === "csv"
          ? "text/csv"
          : options.format === "pdf"
            ? "application/pdf"
            : "application/json",
    });
  }

  private generateMockData(filters: AnalyticsFilters): AnalyticsData {
    const timeMultiplier = this.getTimeMultiplier(filters.timeRange);

    return {
      stats: this.generateStats(timeMultiplier),
      traffic: this.generateTrafficData(timeMultiplier),
      topPages: this.generateTopPagesData(timeMultiplier),
      lastUpdated: new Date(),
      isLoading: false,
    };
  }

  private generateStats(multiplier: number): StatCardData[] {
    return [
      {
        title: "Total Visitors",
        value: `${(18.2 * multiplier).toFixed(1)}K`,
        previousValue: `${(16.2 * multiplier).toFixed(1)}K`,
        change: "+12.5%",
        trend: "up",
        format: "number",
        subtitle: "Unique visitors",
        description: "Total number of unique visitors to your platform",
        progress: 75,
        target: "24K",
      },
      {
        title: "Page Views",
        value: `${(28.4 * multiplier).toFixed(1)}K`,
        previousValue: `${(26.3 * multiplier).toFixed(1)}K`,
        change: "+8.2%",
        trend: "up",
        format: "number",
        subtitle: "Total page impressions",
        description: "Total number of page views across all pages",
        progress: 82,
        target: "35K",
      },
      {
        title: "Avg. Session",
        value: "3m 42s",
        previousValue: "3m 33s",
        change: "+5.1%",
        trend: "up",
        format: "time",
        subtitle: "Time on site",
        description: "Average time users spend on your platform",
        progress: 68,
        target: "4m",
      },
      {
        title: "Conversion Rate",
        value: "3.2%",
        previousValue: "3.6%",
        change: "-0.4%",
        trend: "down",
        format: "percentage",
        subtitle: "Goal completion",
        description: "Percentage of users who complete desired actions",
        progress: 45,
        target: "5%",
      },
    ];
  }

  private generateTrafficData(multiplier: number): TrafficDataPoint[] {
    const baseData = [
      { name: "Mon", baseValue: 4000 },
      { name: "Tue", baseValue: 3000 },
      { name: "Wed", baseValue: 3500 },
      { name: "Thu", baseValue: 2780 },
      { name: "Fri", baseValue: 1890 },
      { name: "Sat", baseValue: 2390 },
      { name: "Sun", baseValue: 3490 },
    ];

    return baseData.map((item) => ({
      name: item.name,
      value: Math.round(item.baseValue * multiplier),
      label: `${((item.baseValue * multiplier) / 1000).toFixed(1)}K`,
    }));
  }

  private generateTopPagesData(multiplier: number): PageData[] {
    const baseData = [
      { page: "/dashboard", visitors: 8421, conversion: 3.2 },
      { page: "/analytics", visitors: 6234, conversion: 2.8 },
      { page: "/reports", visitors: 4892, conversion: 4.1 },
      { page: "/settings", visitors: 3156, conversion: 1.9 },
      { page: "/profile", visitors: 2847, conversion: 0.8 },
    ];

    return baseData.map((item) => ({
      page: item.page,
      visitors: Math.round(item.visitors * multiplier).toLocaleString(),
      conversion: `${item.conversion}%`,
    }));
  }

  private getTimeMultiplier(timeRange: TimeRange): number {
    switch (timeRange) {
      case "24h":
        return 0.1;
      case "7d":
        return 1;
      case "30d":
        return 4.2;
      case "90d":
        return 12.5;
      default:
        return 1;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
const analyticsService = new AnalyticsDataService();

// ===================================
// MAIN HOOK
// ===================================
export const useAnalyticsData = (
  initialFilters?: Partial<AnalyticsFilters>,
): AnalyticsHookReturn => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [filters, setFiltersState] = useState<AnalyticsFilters>({
    timeRange: "7d",
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await analyticsService.fetchData(filters);
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch analytics data";
      setError(errorMessage);
      console.error("Analytics data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized setFilters function
  const setFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Export function
  const exportReport = useCallback(
    async (format: "csv" | "pdf" | "json" = "csv") => {
      try {
        const blob = await analyticsService.exportData({
          format,
          dateRange: filters.timeRange,
          includeCharts: true,
          metrics: data?.stats.map((stat) => stat.title) || [],
        });

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `analytics-report-${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`✅ Analytics report exported as ${format.toUpperCase()}`);
      } catch (err) {
        console.error("Export failed:", err);
        throw err;
      }
    },
    [filters.timeRange, data],
  );

  // Memoized return value to prevent unnecessary re-renders
  // Note: Explicitly including all dependencies to satisfy ESLint
  return useMemo(
    () => ({
      data: data ? { ...data, isLoading, error } : null,
      filters,
      setFilters,
      refetch,
      exportReport,
    }),
    [data, filters, isLoading, error, setFilters, refetch, exportReport],
  );
};

// ===================================
// TIME RANGE HOOK
// ===================================
export const useTimeRange = (
  initialValue: TimeRange = "7d",
): [TimeRange, (range: TimeRange) => void] => {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialValue);

  const handleTimeRangeChange = useCallback((newRange: TimeRange) => {
    setTimeRange(newRange);
  }, []);

  return [timeRange, handleTimeRangeChange];
};

// ===================================
// UTILITY HOOKS
// ===================================
export const useAnalyticsDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useAnalyticsKeyboardShortcuts = (actions: {
  onExport?: () => void;
  onRefresh?: () => void;
  onTimeRangeChange?: (range: TimeRange) => void;
}) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { ctrlKey, metaKey, key, shiftKey } = event;

      // Ctrl/Cmd + E for export
      if ((ctrlKey || metaKey) && key === "e" && actions.onExport) {
        event.preventDefault();
        actions.onExport();
      }

      // Ctrl/Cmd + R for refresh
      if ((ctrlKey || metaKey) && key === "r" && actions.onRefresh) {
        event.preventDefault();
        actions.onRefresh();
      }

      // Shift + 1/2/3/4 for quick time range changes
      if (shiftKey && actions.onTimeRangeChange) {
        switch (key) {
          case "1":
            event.preventDefault();
            actions.onTimeRangeChange("24h");
            break;
          case "2":
            event.preventDefault();
            actions.onTimeRangeChange("7d");
            break;
          case "3":
            event.preventDefault();
            actions.onTimeRangeChange("30d");
            break;
          case "4":
            event.preventDefault();
            actions.onTimeRangeChange("90d");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [actions]);
};
