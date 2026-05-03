import React from 'react'
import './StatCard.css'

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = 'primary',
  subtitle 
}) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-card-info">
          <div className="stat-card-title">{title}</div>
          {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
        </div>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
      
      <div className="stat-card-value">{value}</div>
      
      {trend && (
        <div className={`stat-card-trend trend-${trend}`}>
          <span className="trend-indicator">
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
          {trendValue && <span className="trend-value">{trendValue}</span>}
          <span className="trend-label">vs last period</span>
        </div>
      )}
    </div>
  )
}

export function StatsGrid({ children, columns = 4 }) {
  return (
    <div className="stats-grid" style={{ '--columns': columns }}>
      {children}
    </div>
  )
}
