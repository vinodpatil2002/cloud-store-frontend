import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, File, ExternalLink } from 'lucide-react'
import { getFileCategory, getFileExtension } from '../../lib/utils'
import ShareButton from './ShareButton'

function ModalContent({ file, onClose }) {
  const category = getFileCategory(file.fileType)
  const ext = getFileExtension(file.originalName)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const renderPreview = () => {
    if (category === 'image') {
      return (
        <img
          src={file.url}
          alt={file.originalName}
          draggable={false}
          style={{
            maxWidth: '90vw',
            maxHeight: 'calc(90vh - 60px)',
            width: 'auto',
            height: 'auto',
            display: 'block',
            borderRadius: '6px',
          }}
        />
      )
    }

    if (category === 'video') {
      return (
        <video
          src={file.url}
          controls
          autoPlay={false}
          className="max-w-full max-h-full rounded"
          style={{ maxHeight: 'calc(90vh - 80px)' }}
        />
      )
    }

    if (category === 'pdf') {
      return (
        <iframe
          src={file.url}
          title={file.originalName}
          className="w-full rounded border border-neutral-700"
          style={{ height: 'calc(90vh - 80px)', minWidth: 'min(720px, 90vw)' }}
        />
      )
    }

    if (category === 'doc') {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`
      return (
        <iframe
          src={viewerUrl}
          title={file.originalName}
          className="w-full rounded border border-neutral-700"
          style={{ height: 'calc(90vh - 80px)', minWidth: 'min(720px, 90vw)' }}
        />
      )
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-12">
        <File size={40} strokeWidth={1} className="text-neutral-600" />
        <p className="text-sm text-neutral-400 text-center">{file.originalName}</p>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-[#FAFAFA] border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded transition-colors duration-150"
        >
          <ExternalLink size={13} strokeWidth={1.5} />
          Open file
        </a>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/88"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* Modal panel */}
      <motion.div
        className="relative z-10 flex flex-col max-w-[90vw] max-h-[90vh]"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-medium text-neutral-500 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded uppercase tracking-wide flex-shrink-0">
              {ext}
            </span>
            <span className="text-sm text-neutral-300 truncate">{file.originalName}</span>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <ShareButton file={file} iconSize={14} />
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors duration-150"
              title="Open in new tab"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
            </a>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-[#FAFAFA] transition-colors duration-150 border border-neutral-700 hover:border-neutral-500 rounded p-1"
              title="Close (Esc)"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center justify-center">
          {renderPreview()}
        </div>
      </motion.div>
    </div>
  )
}

export default function FilePreviewModal({ file, onClose }) {
  return createPortal(
    <AnimatePresence>
      {file && <ModalContent file={file} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  )
}
