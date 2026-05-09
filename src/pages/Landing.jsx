import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, ArrowRight, Lock, Zap, HardDrive } from 'lucide-react'

const features = [
  {
    icon: HardDrive,
    title: 'Persistent storage',
    description: 'Files stored securely on Cloudinary. Access them from any device at any time.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    description: 'Every file is tied to your account. No public listings, no sharing without intent.',
  },
  {
    icon: Zap,
    title: 'Instant uploads',
    description: 'Drag and drop or click to upload. JPG, PNG, PDF, MP4, and DOCX supported.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud size={17} strokeWidth={1.5} className="text-neutral-400" />
            <span className="font-bold text-sm tracking-tight text-[#FAFAFA]">CloudStore</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-150 px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium text-[#0F0F0F] bg-[#FAFAFA] hover:bg-[#E8E8E8] transition-colors duration-150 px-3 py-1.5 rounded"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-1.5 border border-neutral-800 rounded px-2.5 py-1 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span className="text-xs text-neutral-500">Storage available</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-light text-[#FAFAFA] leading-tight tracking-tight mb-5 max-w-2xl">
              File storage that<br />stays out of your way
            </h1>
            <p className="text-base text-neutral-500 max-w-lg leading-relaxed mb-10">
              Upload, manage, and access your files from anywhere. No friction,
              no clutter, just your files where you need them.
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#0F0F0F] bg-[#FAFAFA] hover:bg-[#E8E8E8] transition-colors duration-150 px-4 py-2 rounded"
              >
                Create account
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-150 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
            className="border border-neutral-800 rounded-lg overflow-hidden"
          >
            <div className="border-b border-neutral-800 px-5 py-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
              <span className="text-xs text-neutral-600 ml-2">cloudstore — dashboard</span>
            </div>
            <div className="p-6 bg-[#171717]">
              <div className="border border-dashed border-neutral-700 rounded-lg p-8 flex flex-col items-center gap-2 mb-6">
                <Cloud size={20} strokeWidth={1} className="text-neutral-600" />
                <p className="text-sm text-neutral-500">Drop a file here, or <span className="text-neutral-400">click to browse</span></p>
                <p className="text-xs text-neutral-700">JPG, PNG, PDF, MP4, DOCX — up to 10 MB</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['report-q4.pdf', 'design-v2.png', 'demo.mp4'].map((name) => (
                  <div key={name} className="bg-[#0F0F0F] border border-neutral-800 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-neutral-800 flex-shrink-0"></div>
                      <span className="text-xs text-neutral-400 truncate">{name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-600">2.4 MB</span>
                      <span className="text-[10px] text-neutral-700 bg-neutral-800 px-1.5 py-0.5 rounded uppercase">
                        {name.split('.').pop()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-t border-neutral-800">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8"
            >
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title}>
                  <div className="w-8 h-8 border border-neutral-800 rounded flex items-center justify-center mb-4">
                    <Icon size={15} strokeWidth={1.5} className="text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-[#FAFAFA] mb-2">{title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-xs text-neutral-700">CloudStore</span>
          <span className="text-xs text-neutral-700">Built with React + Vite</span>
        </div>
      </footer>
    </div>
  )
}
