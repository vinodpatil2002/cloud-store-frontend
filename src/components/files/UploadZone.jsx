import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../lib/axios'
import { formatBytes } from '../../lib/utils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE = 10 * 1024 * 1024

export default function UploadZone({ onUploadComplete }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)
  const inputRef = useRef(null)

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'File type not supported. Allowed: JPG, PNG, PDF, MP4, DOCX'
    }
    if (file.size > MAX_SIZE) {
      return `File too large. Max size is ${formatBytes(MAX_SIZE)}`
    }
    return null
  }

  const uploadFile = useCallback(async (file) => {
    const validationError = validateFile(file)
    if (validationError) {
      setStatus({ type: 'error', message: validationError })
      return
    }

    setUploading(true)
    setStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setStatus({ type: 'success', message: 'Uploaded successfully' })
      onUploadComplete?.()
      setTimeout(() => setStatus(null), 2000)
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed. Please try again.'
      setStatus({ type: 'error', message })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [onUploadComplete])

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="mb-8">
      <motion.div
        animate={{ scale: dragging ? 1.01 : 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-3 cursor-pointer
          transition-colors duration-150
          ${dragging
            ? 'border-neutral-500 bg-neutral-900'
            : 'border-neutral-800 hover:border-neutral-700 bg-[#171717] hover:bg-neutral-900'
          }
          ${uploading ? 'cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.mp4,.docx"
          onChange={handleInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <Loader2 size={22} strokeWidth={1.5} className="text-neutral-400 animate-spin" />
        ) : status?.type === 'success' ? (
          <CheckCircle size={22} strokeWidth={1.5} className="text-success" />
        ) : (
          <Upload size={22} strokeWidth={1.5} className={dragging ? 'text-neutral-300' : 'text-neutral-600'} />
        )}

        <div className="text-center">
          {uploading ? (
            <p className="text-sm text-neutral-400">Uploading...</p>
          ) : status?.type === 'success' ? (
            <p className="text-sm text-success">{status.message}</p>
          ) : (
            <>
              <p className="text-sm text-neutral-400">
                Drop a file here, or <span className="text-neutral-200">click to browse</span>
              </p>
              <p className="text-xs text-neutral-600 mt-1">JPG, PNG, PDF, MP4, DOCX — up to 10 MB</p>
            </>
          )}
        </div>
      </motion.div>

      {status?.type === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center gap-2 mt-3 text-sm text-danger"
        >
          <AlertCircle size={14} strokeWidth={1.5} />
          <span>{status.message}</span>
        </motion.div>
      )}
    </div>
  )
}
