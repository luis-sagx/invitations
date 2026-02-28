import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const { user, login, signUp, loading, error, clearError } = useAuthStore()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    if (isSignUp) {
      await signUp(email, password, fullName)
    } else {
      await login(email, password)
    }
  }

  const toggleMode = () => {
    clearError()
    setIsSignUp((prev) => !prev)
  }

  return (
    <div className="bg-background min-h-screen flex flex-col text-slate-900">
      {/* Minimal header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white">
        <span className="material-symbols-outlined text-3xl text-primary">
          celebration
        </span>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          EvenSAX
        </h2>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[1280px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side: Image */}
          <div className="hidden lg:flex w-1/2 relative bg-slate-100">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqTDfZv9UcmILsdlIdStqRClFtCblaHEoyK6bR6SzTZ22Lxlxo-Lwh_GcNDGDxT45JpGUNP6eP6dN2rxguIyQmKgzx9dFKfSt_6uY_T5iesffvGmC60XXRrHo67M21j2aMgcB-g9-g_6LIrtG8es9gmJVxh0dtx6x_6Hj3TYi63rVXLtZtAr_xtqVl0vNVKdPfCCIZ-ygBULH_a5wpidUapZbEo5LlrRhUmIv4E5oKb92iDKZ8p0bqvZUoGNl_2iL5kKTvJA-PrXx9')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40 mix-blend-multiply" />
            <div className="relative z-10 flex flex-col justify-end p-12 h-full text-white">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] mb-4">
                Crea Momentos Inolvidables
              </h1>
              <p className="text-lg font-medium opacity-90 max-w-md">
                Únete a miles de organizadores que confían en EvenSAX para el
                seguimiento de RSVPs y gestión de invitados.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-[440px] mx-auto w-full">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                <p className="text-slate-500">
                  {isSignUp
                    ? 'Regístrate para comenzar a crear tus invitaciones.'
                    : 'Ingresa tus credenciales para acceder a tu cuenta.'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Full Name (only on signup) */}
                {isSignUp && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      Nombre Completo
                    </span>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          person
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </label>
                )}

                {/* Email */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-slate-900">
                    Correo Electrónico
                  </span>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                    />
                  </div>
                </label>

                {/* Password */}
                <label className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-900">
                      Contraseña
                    </span>
                    {!isSignUp && (
                      <a
                        className="text-xs font-medium text-primary hover:text-blue-700"
                        href="#"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        isSignUp
                          ? 'Mínimo 6 caracteres'
                          : 'Ingresa tu contraseña'
                      }
                      className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                    />
                  </div>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>
                    {loading
                      ? isSignUp
                        ? 'Creando cuenta...'
                        : 'Ingresando...'
                      : isSignUp
                        ? 'Crear Cuenta'
                        : 'Iniciar Sesión'}
                  </span>
                  {!loading && (
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-8">
                {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                <button
                  onClick={toggleMode}
                  className="font-bold text-primary hover:underline"
                >
                  {isSignUp ? 'Inicia sesión' : 'Regístrate gratis'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; 2024 EvenSAX. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
