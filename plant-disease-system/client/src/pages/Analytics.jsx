import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [analyticsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics`),
        axios.get(`${API_URL}/api/db/stats`)
      ])
      setAnalytics(analyticsRes.data)
      setStats(statsRes.data)
      setError(null)
    } catch (err) {
      setError('Failed to load analytics: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/export/csv`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'detections.csv')
      document.body.appendChild(link)
      link.click()
      link.parentChild.removeChild(link)
    } catch (err) {
      alert('Export failed: ' + err.message)
    }
  }

  const clearCache = async () => {
    try {
      await axios.post(`${API_URL}/api/cache/clear`)
      alert('Cache cleared successfully')
      fetchAnalytics()
    } catch (err) {
      alert('Failed to clear cache')
    }
  }

  if (loading) return <div className="section"><p>Loading analytics...</p></div>
  if (error) return <div className="section error-box"><p>{error}</p></div>

  return (
    <div className="section analytics-section">
      <h1>📊 Analytics Dashboard</h1>
      <p className="subtitle">Plant Disease Detection Statistics & Big Data Insights</p>

      {/* Database Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total_detections}</div>
            <div className="stat-label">Total Detections</div>
            <small>Stored in SQLite Database</small>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.cache_size?.keys || 0}</div>
            <div className="stat-label">Cached Items</div>
            <small>Node-Cache (10min TTL)</small>
          </div>
          <div className="stat-card">
            <div className="stat-value">SQLite3</div>
            <div className="stat-label">Database</div>
            <small>Big Data Technology #1</small>
          </div>
          <div className="stat-card">
            <div className="stat-value">Node-Cache</div>
            <div className="stat-label">Caching</div>
            <small>Big Data Technology #2</small>
          </div>
        </div>
      )}

      {/* Disease Distribution */}
      {analytics && analytics.disease_distribution && (
        <div className="chart-container">
          <h2>Disease Distribution</h2>
          <div className="disease-chart">
            {analytics.disease_distribution.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Disease Name</th>
                    <th>Count</th>
                    <th>Avg Confidence</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.disease_distribution.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.disease_name || 'N/A'}</strong></td>
                      <td>{item.count}</td>
                      <td>{(item.avg_conf || 0).toFixed(1)}%</td>
                      <td>
                        <div className="bar" style={{ 
                          width: `${Math.min(item.count * 10, 100)}%`,
                          backgroundColor: item.count > 20 ? '#e74c3c' : '#3498db'
                        }}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No disease data available</p>}
          </div>
        </div>
      )}

      {/* Severity Distribution */}
      {analytics && analytics.severity_distribution && (
        <div className="chart-container">
          <h2>Severity Distribution</h2>
          <div className="severity-chart">
            {analytics.severity_distribution.length > 0 ? (
              <div className="severity-bars">
                {analytics.severity_distribution.map((item, idx) => (
                  <div key={idx} className="severity-item">
                    <div className={`severity-badge ${item.severity || 'unknown'}`}>
                      {item.severity || 'Unknown'}: {item.count}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p>No severity data available</p>}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {analytics && analytics.summary && (
        <div className="summary-section">
          <h2>Summary Statistics</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <label>Total Processed:</label>
              <strong>{analytics.summary.total || 0}</strong>
            </div>
            <div className="summary-item">
              <label>Average Confidence:</label>
              <strong>{(analytics.summary.avg_confidence || 0).toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="analytics-actions">
        <button onClick={fetchAnalytics} className="btn btn-primary">
          🔄 Refresh Analytics
        </button>
        <button onClick={exportCSV} className="btn btn-success">
          📥 Export CSV
        </button>
        <button onClick={clearCache} className="btn btn-warning">
          🗑️ Clear Cache
        </button>
      </div>

      {/* Technologies Info */}
      <div className="tech-info-box">
        <h3>🚀 Big Data Technologies Used</h3>
        <ul>
          <li><strong>SQLite3:</strong> Persistent relational database for storing all detection records</li>
          <li><strong>Node-Cache:</strong> In-memory caching with automatic TTL for faster analytics queries</li>
          <li><strong>Sharp:</strong> Image processing and compression (224x224 for ML)</li>
          <li><strong>CSV Export:</strong> Batch data export for external analysis</li>
          <li><strong>Data Aggregation:</strong> Real-time analytics with GROUP BY queries</li>
        </ul>
      </div>
    </div>
  )
}
