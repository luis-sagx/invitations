import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface PublicHeaderProps {
  variant?: 'login' | 'public'
}

export function PublicHeader({ variant = 'login' }: PublicHeaderProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 lg:px-10 py-4 shadow-sm z-10 sticky top-0">
      <Link to="/" className="flex items-center gap-4">
        <div className="size-8 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">
            celebration
          </span>
        </div>
        <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-[-0.015em]">
          EventFlow
        </h2>
      </Link>
      <div className="flex flex-1 justify-end gap-8">
        {variant === 'login' && (
          <>
            <div className="hidden md:flex items-center gap-9">
              <a
                className="text-slate-600 hover:text-primary transition-colors text-sm font-medium"
                href="#"
              >
                Features
              </a>
              <a
                className="text-slate-600 hover:text-primary transition-colors text-sm font-medium"
                href="#"
              >
                Pricing
              </a>
              <a
                className="text-slate-600 hover:text-primary transition-colors text-sm font-medium"
                href="#"
              >
                About
              </a>
            </div>
            <Link
              to="/login"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
        {variant === 'public' && (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </div>
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
        <div className="size-8 text-primary">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight">
          EventFlow
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
