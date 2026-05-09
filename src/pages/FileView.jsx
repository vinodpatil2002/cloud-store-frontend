import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, ExternalLink, Loader2, FileText, File, Video, AlertCircle } from 'lucide-react'
import api from '../lib/axios'
import ShareButton from '../components/files/ShareButton'
import { formatBytes, formatDate, getFileCategory, getFileExtension } from '../lib/utils'

function FileViewer({ file }) {
  const category = getFileCategory(file.fileType)

  if (category === 'image') {
    return (
      <img
        src={file.url}
        alt={file.originalName}
        style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 220px)', width: 'auto', height: 'auto', display: 'block', borderRadius: '6px' }}
      />
    )
  }

  if (category === 'video') {
    return (
      <video
        src={file.url}
        controls
        style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 220px)', borderRadius: '6px' }}
      />
    )
  }

  if (category === 'pdf') {
    return (
      <iframe
        src={file.url}
        title={file.originalName}
        className="w-full rounded border border-neutral-800"
        style={{ height: 'calc(100vh - 220px)', minWidth: 'min(780px, 100%)' }}
      />
    )
  }

  if (category === 'doc') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 px-12 border border-neutral-800 rounded-lg bg-[#171717]">
        <div className="w-14 h-14 border border-neutral-700 rounded-lg flex items-center justify-center bg-neutral-800">
          <FileText size={26} strokeWidth={1} className="text-neutral-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#FAFAFA] mb-1">{file.originalName}</p>
          <p className="text-xs text-neutral-500">Word Document — browser preview not supported</p>
        </div>
        <a
          href={file.url}
          download={file.originalName}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-[#0F0F0F] bg-[#FAFAFA] hover:bg-[#E8E8E8] transition-colors duration-150 px-5 py-2 rounded"
        >
          <ExternalLink size={13} strokeWidth={1.5} />
          Download file
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 border border-neutral-800 rounded-lg bg-[#171717] px-12">
      <File size={36} strokeWidth={1} className="text-neutral-600" />
      <p className="text-sm text-neutral-400">Preview not available for this file type</p>
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

export default function FileView() {
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/files/public/${id}`)
      .then(({ data }) => setFile(data.file))
      .catch((err) => setError(err.response?.data?.message || 'File not found or unavailable.'))
      .finally(() => setLoading(false))
  }, [id])

  const ext = file ? getFileExtension(file.originalName) : ''

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Cloud size={17} strokeWidth={1.5} className="text-neutral-400" />
            <span className="font-bold text-sm tracking-tight text-[#FAFAFA]">CloudStore</span>
          </Link>
          <Link
            to="/register"
            className="text-xs font-medium text-[#0F0F0F] bg-[#FAFAFA] hover:bg-[#E8E8E8] transition-colors duration-150 px-3 py-1.5 rounded"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={20} strokeWidth={1.5} className="text-neutral-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <AlertCircle size={24} strokeWidth={1} className="text-neutral-600" />
            <p className="text-sm text-neutral-500">{error}</p>
            <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-150">
              Go home
            </Link>
          </div>
        )}

        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-5"
          >
            {/* File meta bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-shrink-0 text-[10px] font-medium text-neutral-500 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded uppercase tracking-wide">
                  {ext}
                </span>
                <h1 className="text-sm font-medium text-[#FAFAFA] truncate">{file.originalName}</h1>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-neutral-600 hidden sm:block">{formatBytes(file.size)}</span>
                <ShareButton file={file} iconSize={14} />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors duration-150"
                  title="Open original"
                >
                  <ExternalLink size={14} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-start justify-center">
              <FileViewer file={file} />
            </div>

            {/* Footer note */}
            <p className="text-xs text-neutral-700 text-center">
              Shared via <Link to="/" className="text-neutral-500 hover:text-neutral-400 transition-colors duration-150">CloudStore</Link>
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
