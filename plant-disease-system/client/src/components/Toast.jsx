import React, { useState, useEffect } from 'react'
import './Toast.css'

let toastId = 0
let toastCallback = null

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    if (toastCallback) {
      toastCallback({ id: ++toastId, message, type, duration })
    }
  }

  return { showToast }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastCallback = (toast) => {
      setToasts(prev => [...prev, toast])
      
      if (toast.duration > 0) {
        setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
      }
    }

    return () => {
      toastCallback = null
    }
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}
