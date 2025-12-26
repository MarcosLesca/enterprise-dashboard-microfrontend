import React from "react";
import { Users } from "lucide-react";
import StatCard from "./StatCard";
import type { StatCardProps } from "../types/analytics";

export interface StatsGridProps {
  stats: StatCardProps[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4 | "auto";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  loading = false,
  columns = "auto",
  gap = "md",
  className = "",
}) => {
  const gridClasses = {
    auto: "grid-cols-auto",
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-sm",
    md: "gap-md",
    lg: "gap-lg",
  };

  const gridClassName =
    `stats-grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`.trim();

  if (loading && stats.length === 0) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 4 }).map((_, skeletonIndex) => (
          <StatCard
            key={`skeleton-stat-${skeletonIndex}`}
            title="Loading"
            value="..."
            change="..."
            icon={Users}
            color="#gray"
            trend="neutral"
            format="number"
            loading={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {stats.map((stat) => (
        <StatCard key={`stat-${stat.title}`} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
