import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Cloud } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-neutral-800 bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-[#FAFAFA] no-underline">
          <Cloud size={18} strokeWidth={1.5} className="text-neutral-400" />
          <span className="font-bold text-sm tracking-tight">CloudStore</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-xs text-neutral-500 hidden sm:block">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#FAFAFA] transition-colors duration-150 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded"
              >
                <LogOut size={13} strokeWidth={1.5} />
                <span>Sign out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
