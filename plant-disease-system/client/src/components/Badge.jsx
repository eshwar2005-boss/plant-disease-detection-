import React from 'react'
import './Badge.css'

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = '' 
}) {
  const classNames = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={classNames}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const variants = {
    success: 'success',
    healthy: 'success',
    active: 'success',
    error: 'danger',
    diseased: 'danger',
    inactive: 'danger',
    warning: 'warning',
    pending: 'warning',
    info: 'info',
    unknown: 'default'
  }

  return (
    <Badge variant={variants[status.toLowerCase()] || 'default'}>
      {status}
    </Badge>
  )
}
