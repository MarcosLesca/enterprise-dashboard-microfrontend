import { TimeRange, ExportReportData } from "../app/types";

export const useExportReport = (timeRange: TimeRange) => {
  const exportReport = (statsData: ExportReportData["stats"]) => {
    const dataStr = JSON.stringify({ stats: statsData, timeRange }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr,
    )}`;
    const exportFileDefaultName = `analytics-report-${timeRange}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return { exportReport };
};
