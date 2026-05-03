import React, { useRef, useState } from 'react'
import './FileUpload.css'

export default function FileUpload({ 
  onFileSelect, 
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload File',
  helperText = 'Drag and drop or click to upload',
  error
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }
    setFileName(file.name)
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="file-upload-container">
      {label && <label className="file-upload-label">{label}</label>}
      
      <div 
        className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept={accept}
          onChange={handleFileInput}
          className="file-upload-input"
        />
        
        <div className="file-upload-icon">📁</div>
        
        {fileName ? (
          <>
            <div className="file-upload-filename">{fileName}</div>
            <div className="file-upload-text">Click to change file</div>
          </>
        ) : (
          <>
            <div className="file-upload-text">{helperText}</div>
            <div className="file-upload-subtext">
              {accept.includes('image') ? 'PNG, JPG, JPEG' : 'Any file'} • Max {maxSize / 1024 / 1024}MB
            </div>
          </>
        )}
      </div>
      
      {error && <span className="file-upload-error">{error}</span>}
    </div>
  )
}
