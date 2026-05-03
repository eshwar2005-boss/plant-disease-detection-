import React from 'react'
import Button from './Button'
import './EmptyState.css'

export default function EmptyState({ 
  icon = '📭',
  title = 'No data found',
  description,
  action,
  actionLabel,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {(action || (actionLabel && onAction)) && (
        <div className="empty-state-action">
          {action || (
            <Button onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
