import React, { useState } from 'react'
import './Tooltip.css'

export default function Tooltip({ 
  children, 
  content,
  position = 'top',
  delay = 200 
}) {
  const [show, setShow] = useState(false)
  let timeout

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setShow(true)
    }, delay)
  }

  const hideTooltip = () => {
    clearTimeout(timeout)
    setShow(false)
  }

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {show && content && (
        <div className={`tooltip tooltip-${position}`}>
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  )
}
