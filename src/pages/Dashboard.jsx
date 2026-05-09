import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Layout from '../components/layout/Layout'
import UploadZone from '../components/files/UploadZone'
import FileGrid from '../components/files/FileGrid'
import api from '../lib/axios'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFiles = useCallback(async () => {
    setError('')
    try {
      const { data } = await api.get('/files')
      setFiles(data.files || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load files.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDelete = useCallback(async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`)
      setFiles((prev) => prev.filter((f) => f._id !== fileId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete file.')
    }
  }, [])

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-[#FAFAFA]">
            {user?.name ? `${user.name}'s files` : 'Your files'}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {loading ? 'Loading...' : `${files.length} ${files.length === 1 ? 'file' : 'files'}`}
          </p>
        </div>

        <UploadZone onUploadComplete={fetchFiles} />

        {error && (
          <p className="text-sm text-danger mb-6">{error}</p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} strokeWidth={1.5} className="text-neutral-600 animate-spin" />
          </div>
        ) : (
          <FileGrid files={files} onDelete={handleDelete} />
        )}
      </motion.div>
    </Layout>
  )
}
