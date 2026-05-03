import React, { useState } from 'react'
import './SearchBar.css'

export default function SearchBar({ 
  placeholder = 'Search...',
  onSearch,
  onChange,
  value: controlledValue,
  icon = '🔍',
  className = ''
}) {
  const [internalValue, setInternalValue] = useState('')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleChange = (e) => {
    const newValue = e.target.value
    
    if (!isControlled) {
      setInternalValue(newValue)
    }
    
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    if (onChange) {
      onChange('')
    }
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`search-bar ${className}`}>
      <span className="search-icon">{icon}</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button 
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  )
}
