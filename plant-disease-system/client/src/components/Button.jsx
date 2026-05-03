import React from 'react'
import './Button.css'

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props 
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    className
  ].filter(Boolean).join(' ')

  return (
    <button 
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
