import React from 'react'
import './Input.css'

export function Input({ 
  label, 
  error, 
  helperText,
  icon,
  className = '',
  ...props 
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}

export function TextArea({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <textarea 
        className={`input textarea ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}

export function Select({ 
  label, 
  error, 
  helperText,
  options = [],
  className = '',
  ...props 
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <select 
        className={`input select ${error ? 'input-error' : ''}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}

export default Input
