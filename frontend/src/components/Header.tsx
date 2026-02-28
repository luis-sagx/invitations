import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface PublicHeaderProps {
  variant?: 'login' | 'public'
}

export function PublicHeader(_props: PublicHeaderProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 lg:px-10 py-4 shadow-sm z-10 sticky top-0">
      <Link to="/" className="flex items-center gap-4">
        <div className="size-8 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">
            celebration
          </span>
        </div>
        <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-[-0.015em]">
          EvenSAX
        </h2>
      </Link>
    </header>
  )
}

export function AppHeader() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-4 lg:px-10">
      <Link to="/dashboard" className="flex items-center gap-4">
        <div className="size-8 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">
            celebration
          </span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight">
          EvenSAX
        </h2>
      </Link>
      <div className="hidden lg:flex items-center gap-8">
        <Link
          to="/dashboard"
          className="text-slate-600 hover:text-primary transition-colors text-sm font-bold"
        >
          Dashboard
        </Link>
        <Link
          to="/create"
          className="text-slate-600 hover:text-primary transition-colors text-sm font-bold"
        >
          Crear Evento
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/create"
          className="hidden sm:flex h-10 items-center justify-center rounded-full bg-primary px-6 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          Crear Nuevo
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-sm text-slate-600 font-medium">
            {user?.full_name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-500 transition-colors font-medium"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
