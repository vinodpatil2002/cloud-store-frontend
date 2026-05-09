import { motion, AnimatePresence } from 'framer-motion'
import { Upload } from 'lucide-react'
import FileCard from './FileCard'

export default function FileGrid({ files, onDelete }) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Upload size={28} strokeWidth={1} className="text-neutral-700 mb-4" />
        <p className="text-sm text-neutral-500">No files uploaded yet</p>
        <p className="text-xs text-neutral-700 mt-1">Upload a file above to get started</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <AnimatePresence mode="popLayout">
        {files.map((file, i) => (
          <motion.div
            key={file._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, delay: i * 0.05, ease: 'easeOut' }}
          >
            <FileCard file={file} onDelete={onDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
