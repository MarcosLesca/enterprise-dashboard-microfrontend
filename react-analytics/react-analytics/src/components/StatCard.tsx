import React, { useState } from "react";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Info,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  previousValue?: string;
  change: string;
  icon: LucideIcon;
  color: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
  subtitle?: string;
  description?: string;
  progress?: number; // 0-100
  target?: string;
  format?: "number" | "percentage" | "time" | "currency";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  previousValue,
  change,
  icon: IconComponent,
  color,
  trend = "up",
  loading = false,
  subtitle,
  description,
  progress,
  target,
  format = "number",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div className="stat-card stat-card--loading">
        <div className="stat-card__skeleton">
          <div className="stat-card__skeleton-header">
            <div className="stat-card__skeleton-icon"></div>
            <div className="stat-card__skeleton-title"></div>
            <div className="stat-card__skeleton-menu"></div>
          </div>
          <div className="stat-card__skeleton-value"></div>
          <div className="stat-card__skeleton-change">
            <div className="stat-card__skeleton-trend"></div>
            <div className="stat-card__skeleton-text"></div>
          </div>
          {progress && <div className="stat-card__skeleton-progress"></div>}
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "stat-card__trend--positive";
      case "down":
        return "stat-card__trend--negative";
      default:
        return "stat-card__trend--neutral";
    }
  };

  const getTrendLabel = () => {
    switch (trend) {
      case "up":
        return "vs previous period";
      case "down":
        return "vs previous period";
      default:
        return "no change";
    }
  };

  const formatValue = (val: string) => {
    switch (format) {
      case "currency":
        return `$${val}`;
      case "percentage":
        return `${val}`;
      default:
        return val;
    }
  };

  const TrendIcon = getTrendIcon();
  const trendClass = getTrendColor();
  const trendLabel = getTrendLabel();

  return (
    <div
      className={`stat-card ${
        isHovered ? "stat-card--hovered" : ""
      } ${trendClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header con icon, title y actions */}
      <div className="stat-card__header">
        <div className="stat-card__icon-container">
          <div
            className="stat-card__icon"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <IconComponent size={20} strokeWidth={2} />
          </div>
          <div className="stat-card__title-group">
            <h3 className="stat-card__title">{title}</h3>
            {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="stat-card__actions">
          {description && (
            <button className="stat-card__info" title={description}>
              <Info size={16} />
            </button>
          )}
          <div className="stat-card__menu">
            <button
              className="stat-card__menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreHorizontal size={16} />
            </button>
            {isMenuOpen && (
              <div className="stat-card__dropdown">
                <button className="stat-card__dropdown-item">
                  View Details
                </button>
                <button className="stat-card__dropdown-item">Export</button>
                <button className="stat-card__dropdown-item">Configure</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Valor principal */}
      <div className="stat-card__value-container">
        <div className="stat-card__value">{formatValue(value)}</div>
        {previousValue && (
          <div className="stat-card__previous">
            Previous: {formatValue(previousValue)}
          </div>
        )}
      </div>

      {/* Trend y cambio */}
      <div className="stat-card__change">
        {TrendIcon && (
          <div className="stat-card__trend">
            <TrendIcon size={18} strokeWidth={2.5} />
            <span className="stat-card__change-value">{change}</span>
          </div>
        )}
        <span className="stat-card__change-label">{trendLabel}</span>
      </div>

      {/* Progress bar (opcional) */}
      {progress !== undefined && (
        <div className="stat-card__progress">
          <div className="stat-card__progress-header">
            <span className="stat-card__progress-label">Progress</span>
            {target && (
              <span className="stat-card__progress-target">
                Target: {target}
              </span>
            )}
          </div>
          <div className="stat-card__progress-bar">
            <div
              className="stat-card__progress-fill"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                backgroundColor: color,
              }}
            ></div>
          </div>
          <div className="stat-card__progress-value">{progress}%</div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
