import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, MoreHorizontal, Info } from "lucide-react";

interface TableData {
  page: string;
  visitors: string;
  conversion: string;
}

interface DataTableProps {
  data: TableData[];
  title?: string;
  loading?: boolean;
}

// Dark mode colors (solo modo oscuro como en DataTable)
const colors = {
  background: "rgb(17, 24, 39)",
  border: "rgb(55, 65, 81)",
  text: "white",
  headerBg: "rgb(31, 41, 55)",
  headerText: "white",
  skeletonBg: "rgb(55, 65, 81)",
  gridLines: "rgb(55, 65, 81)",
  pageIndicator: "rgb(59, 130, 246)",
  pageText: "white",
  numbersText: "white",
  conversionText: "rgb(134, 239, 172)",
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  title = "Top Pages",
  loading = false,
}) => {
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: colors.background,
          borderRadius: "0.5rem",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: colors.text,
            padding: "1rem 1.5rem",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {title}
        </h3>
        <div style={{ padding: "1.5rem" }}>
          {[...Array(4)].map((_, index) => (
            <div
              key={`skeleton-${skeletonIndex}`}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  height: "1rem",
                  backgroundColor: colors.skeletonBg,
                  borderRadius: "0.25rem",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              ></div>
              <div
                style={{
                  height: "1rem",
                  backgroundColor: colors.skeletonBg,
                  borderRadius: "0.25rem",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              ></div>
              <div
                style={{
                  height: "1rem",
                  backgroundColor: colors.skeletonBg,
                  borderRadius: "0.25rem",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors.background,
        borderRadius: "0.5rem",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          color: colors.text,
          padding: "1rem 1.5rem",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {title}
      </h3>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0px",
            tableLayout: "fixed",
          }}
        >
          {/* Headers */}
          <thead>
            <tr style={{ backgroundColor: colors.headerBg }}>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  color: colors.headerText,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  width: "33.333%",
                  borderTopLeftRadius: "0.5rem",
                  borderBottom: "2px solid rgb(59, 130, 246)",
                }}
              >
                Page
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  color: colors.headerText,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  width: "33.333%",
                  borderBottom: "2px solid rgb(59, 130, 246)",
                }}
              >
                Visitors
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  color: colors.headerText,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  width: "33.333%",
                  borderTopRightRadius: "0.5rem",
                  borderBottom: "2px solid rgb(59, 130, 246)",
                }}
              >
                Conversion
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row) => (
              <tr
                key={row.page}
                style={{
                  borderBottom: `1px solid ${colors.gridLines}`,
                }}
              >
                {/* Page - left align */}
                <td
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    verticalAlign: "middle",
                    width: "33.333%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        width: "0.5rem",
                        height: "0.5rem",
                        backgroundColor: colors.pageIndicator,
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    ></span>
                    <span
                      style={{
                        fontFamily:
                          '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                        color: colors.pageText,
                        fontWeight: "500",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row.page}
                    </span>
                  </div>
                </td>

                {/* Visitors - center align */}
                <td
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    verticalAlign: "middle",
                    width: "33.333%",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                      color: colors.numbersText,
                      fontWeight: "600",
                      fontSize: "0.9375rem",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {row.visitors}
                  </span>
                </td>

                {/* Conversion - center align */}
                <td
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    verticalAlign: "middle",
                    width: "33.333%",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                      color: colors.conversionText,
                      fontWeight: "500",
                      fontSize: "0.875rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {row.conversion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
