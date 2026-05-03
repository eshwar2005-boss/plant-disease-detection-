import React, { useState } from 'react'
import './Tabs.css'

export default function Tabs({ tabs = [], defaultTab = 0, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabClick = (index) => {
    setActiveTab(index)
    if (onChange) {
      onChange(index)
    }
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}
