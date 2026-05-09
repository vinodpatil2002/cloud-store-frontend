import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, FileText, Image, Video, File, ExternalLink } from 'lucide-react'
import { formatBytes, formatDate, getFileCategory, getFileExtension } from '../../lib/utils'
import FilePreviewModal from './FilePreviewModal'
import ShareButton from './ShareButton'

function getVideoThumbnailUrl(url) {
  return url.replace(/\.(mp4|mov|webm|avi)(\?.*)?$/i, '.jpg')
}

function PreviewArea({ file, category, onClick }) {
  const [imgError, setImgError] = useState(false)
  const Icon = category === 'video' ? Video : category === 'pdf' ? FileText : category === 'doc' ? FileText : File

  const base = (
    <div
      className="h-[140px] bg-neutral-800 overflow-hidden cursor-pointer group"
      onClick={onClick}
    />
  )

  if (category === 'image' && !imgError) {
    return (
      <div
        className="h-[140px] bg-neutral-800 overflow-hidden cursor-pointer relative"
        onClick={onClick}
      >
        <img
          src={file.url}
          alt={file.originalName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-150"
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-150" />
      </div>
    )
  }

  if (category === 'video' && !imgError) {
    return (
      <div
        className="h-[140px] bg-neutral-800 overflow-hidden relative cursor-pointer"
        onClick={onClick}
      >
        <img
          src={getVideoThumbnailUrl(file.url)}
          alt={file.originalName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors duration-150">
          <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center">
            <Video size={15} strokeWidth={1.5} className="text-white ml-0.5" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-[140px] bg-neutral-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-750 transition-colors duration-150"
      onClick={onClick}
    >
      <Icon size={24} strokeWidth={1} className="text-neutral-600" />
      <span className="text-[10px] text-neutral-600 uppercase tracking-wide">
        {getFileExtension(file.originalName)}
      </span>
    </div>
  )
}

export default function FileCard({ file, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [previewing, setPreviewing] = useState(false)

  const category = getFileCategory(file.fileType)
  const ext = getFileExtension(file.originalName)

  const handleDeleteClick = (e) => { e.stopPropagation(); setConfirming(true) }
  const handleCancel = () => setConfirming(false)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    await onDelete(file._id)
    setDeleting(false)
    setConfirming(false)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-[#171717] border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-colors duration-150 flex flex-col"
      >
        <PreviewArea file={file} category={category} onClick={() => setPreviewing(true)} />

        <div className="p-4 flex flex-col gap-3">
          <div
            className="flex items-start justify-between gap-2 cursor-pointer"
            onClick={() => setPreviewing(true)}
          >
            <p className="text-sm font-medium text-[#FAFAFA] truncate leading-tight min-w-0">
              {file.originalName}
            </p>
            <span className="flex-shrink-0 text-[10px] font-medium text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded uppercase tracking-wide">
              {ext}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-neutral-500">{formatBytes(file.size)}</span>
              <span className="text-xs text-neutral-600">{formatDate(file.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2.5">
              {file.url && (
                <ShareButton file={file} iconSize={13} />
              )}
              {file.url && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors duration-150"
                  title="Open in new tab"
                >
                  <ExternalLink size={13} strokeWidth={1.5} />
                </a>
              )}
              <button
                onClick={handleDeleteClick}
                className="text-neutral-500 hover:text-danger transition-colors duration-150"
                title="Delete file"
                disabled={deleting}
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {confirming && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="border-t border-neutral-800 pt-3">
                  <p className="text-xs text-neutral-400 mb-2.5">Delete this file permanently?</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleting}
                      className="text-xs font-medium text-white bg-danger hover:bg-red-600 transition-colors duration-150 px-3 py-1.5 rounded disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={deleting}
                      className="text-xs font-medium text-neutral-400 hover:text-neutral-200 border border-neutral-700 hover:border-neutral-600 transition-colors duration-150 px-3 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <FilePreviewModal file={previewing ? file : null} onClose={() => setPreviewing(false)} />
    </>
  )
}
