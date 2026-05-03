import React, { useState } from 'react'
import './Accordion.css'

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button 
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="accordion-title">{title}</span>
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="accordion-content">
        <div className="accordion-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Accordion({ children, allowMultiple = false }) {
  return (
    <div className="accordion">
      {children}
    </div>
  )
}
