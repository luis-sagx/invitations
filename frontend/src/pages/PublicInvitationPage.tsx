import { useState, useEffect, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { PublicHeader } from '@/components/Header'
import { useEventStore } from '@/stores/eventStore'
import { LocationMap } from '@/components/LocationMap'
import { AnimatedMascot } from '@/components/AnimatedMascot'

const CATEGORY_THEMES: Record<
  string,
  {
    icon: string
    label: string
    accent: string
    bg: string
    gradient: string
    decorations: { icon: string; pos: string; size: string; rotate: string }[]
  }
> = {
  wedding: {
    icon: 'favorite',
    label: 'Boda',
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    gradient: 'from-rose-400/30 to-pink-300/20',
    decorations: [
      {
        icon: 'favorite',
        pos: 'top-20 left-10',
        size: 'text-6xl',
        rotate: 'rotate-12',
      },
      {
        icon: 'local_florist',
        pos: 'top-40 right-16',
        size: 'text-8xl',
        rotate: '-rotate-12',
      },
      {
        icon: 'favorite',
        pos: 'bottom-40 left-16',
        size: 'text-7xl',
        rotate: 'rotate-45',
      },
    ],
  },
  birthday: {
    icon: 'cake',
    label: 'Cumpleaños',
    accent: 'text-purple-600',
    bg: 'bg-purple-50',
    gradient: 'from-purple-400/30 to-indigo-300/20',
    decorations: [
      {
        icon: 'cake',
        pos: 'top-24 left-8',
        size: 'text-6xl',
        rotate: '-rotate-6',
      },
      {
        icon: 'celebration',
        pos: 'top-36 right-12',
        size: 'text-8xl',
        rotate: 'rotate-12',
      },
      {
        icon: 'auto_awesome',
        pos: 'bottom-44 left-20',
        size: 'text-7xl',
        rotate: 'rotate-45',
      },
    ],
  },
  corporate: {
    icon: 'business_center',
    label: 'Corporativo',
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    gradient: 'from-blue-500/30 to-cyan-300/20',
    decorations: [
      {
        icon: 'trending_up',
        pos: 'top-20 left-8',
        size: 'text-6xl',
        rotate: '-rotate-12',
      },
      {
        icon: 'handshake',
        pos: 'top-44 right-16',
        size: 'text-7xl',
        rotate: 'rotate-6',
      },
      {
        icon: 'business_center',
        pos: 'bottom-40 left-16',
        size: 'text-6xl',
        rotate: 'rotate-12',
      },
    ],
  },
  graduation: {
    icon: 'school',
    label: 'Graduación',
    accent: 'text-green-600',
    bg: 'bg-green-50',
    gradient: 'from-green-400/30 to-emerald-300/20',
    decorations: [
      {
        icon: 'school',
        pos: 'top-24 left-10',
        size: 'text-6xl',
        rotate: 'rotate-12',
      },
      {
        icon: 'auto_awesome',
        pos: 'top-40 right-14',
        size: 'text-8xl',
        rotate: '-rotate-12',
      },
      {
        icon: 'military_tech',
        pos: 'bottom-40 left-20',
        size: 'text-7xl',
        rotate: 'rotate-45',
      },
    ],
  },
  baptism: {
    icon: 'water_drop',
    label: 'Bautizo',
    accent: 'text-sky-500',
    bg: 'bg-sky-50',
    gradient: 'from-sky-300/30 to-blue-200/20',
    decorations: [
      {
        icon: 'water_drop',
        pos: 'top-20 left-8',
        size: 'text-6xl',
        rotate: 'rotate-12',
      },
      {
        icon: 'spa',
        pos: 'top-44 right-14',
        size: 'text-8xl',
        rotate: '-rotate-6',
      },
      {
        icon: 'church',
        pos: 'bottom-40 left-16',
        size: 'text-7xl',
        rotate: 'rotate-30',
      },
    ],
  },
  social: {
    icon: 'groups',
    label: 'Social',
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    gradient: 'from-amber-400/30 to-orange-300/20',
    decorations: [
      {
        icon: 'local_bar',
        pos: 'top-20 left-10',
        size: 'text-6xl',
        rotate: '-rotate-12',
      },
      {
        icon: 'music_note',
        pos: 'top-40 right-16',
        size: 'text-8xl',
        rotate: 'rotate-12',
      },
      {
        icon: 'celebration',
        pos: 'bottom-40 left-16',
        size: 'text-7xl',
        rotate: 'rotate-30',
      },
    ],
  },
}

const DEFAULT_THEME = CATEGORY_THEMES.social

export default function PublicInvitationPage() {
  const { slug } = useParams<{ slug: string }>()
  const { currentEvent, fetchEventBySlug, confirmGuest, loading } =
    useEventStore()
  const [showModal, setShowModal] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchEventBySlug(slug).finally(() => setInitialLoad(false))
    }
  }, [slug, fetchEventBySlug])

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentEvent || !guestName.trim()) return
    const success = await confirmGuest(currentEvent.id, guestName.trim())
    if (success) {
      setConfirmed(true)
      setTimeout(() => setShowModal(false), 2000)
    }
  }

  // Show loading while fetching OR during initial load
  if (loading || initialLoad) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-4 block animate-spin">
            progress_activity
          </span>
          <p>Cargando invitación...</p>
        </div>
      </div>
    )
  }

  // Only show not-found AFTER loading is complete
  if (!currentEvent) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-4 block">
            event_busy
          </span>
          <p className="text-lg font-medium">Invitación no encontrada</p>
          <p className="text-sm mt-2">
            Este enlace puede no ser válido o el evento ya no está disponible.
          </p>
        </div>
      </div>
    )
  }

  const event = currentEvent
  const theme = CATEGORY_THEMES[event.category] ?? DEFAULT_THEME

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    } catch {
      return dateStr
    }
  }

  const formatTime = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(':')
      const hour = parseInt(h)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${m} ${ampm}`
    } catch {
      return timeStr
    }
  }

  const hasCoords = event.location_lat != null && event.location_lng != null

  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden text-slate-900 antialiased">
      <PublicHeader variant="public" />

      <main className="flex flex-col items-center justify-center w-full py-10 px-4 pb-24 md:pb-10 relative">
        {/* Category-specific decorations */}
        {theme.decorations.map((d, i) => (
          <div
            key={i}
            className={`absolute ${d.pos} opacity-10 pointer-events-none select-none hidden lg:block ${theme.accent}`}
          >
            <span className={`material-symbols-outlined ${d.size} ${d.rotate}`}>
              {d.icon}
            </span>
          </div>
        ))}

        {/* Invitation Card */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10">
          {/* Hero Image */}
          <div className="w-full aspect-[21/9] bg-slate-200 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${event.cover_image_url}')` }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} to-transparent flex items-end p-8`}
            >
              <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30 inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">
                  {theme.icon}
                </span>
                {theme.label}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {event.title}
            </h1>

            {event.description && (
              <p className="text-lg text-slate-600 max-w-lg mx-auto mb-8 font-medium">
                {event.description}
              </p>
            )}

            {/* Event Info Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-left md:text-center">
              <div
                className={`flex flex-row md:flex-col items-center md:justify-center gap-4 p-4 rounded-2xl ${theme.bg}`}
              >
                <div
                  className={`size-10 rounded-full ${theme.bg} flex items-center justify-center ${theme.accent} shrink-0`}
                >
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Fecha</p>
                  <p className="text-sm text-slate-500 capitalize">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
              <div
                className={`flex flex-row md:flex-col items-center md:justify-center gap-4 p-4 rounded-2xl ${theme.bg}`}
              >
                <div
                  className={`size-10 rounded-full ${theme.bg} flex items-center justify-center ${theme.accent} shrink-0`}
                >
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Hora</p>
                  <p className="text-sm text-slate-500">
                    {formatTime(event.time)}
                  </p>
                </div>
              </div>
              <div
                className={`flex flex-row md:flex-col items-center md:justify-center gap-4 p-4 rounded-2xl ${theme.bg}`}
              >
                <div
                  className={`size-10 rounded-full ${theme.bg} flex items-center justify-center ${theme.accent} shrink-0`}
                >
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Lugar</p>
                  <p className="text-sm text-slate-500">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Map - only show when coordinates exist */}
            {hasCoords && (
              <div className="mb-10">
                <LocationMap
                  lat={event.location_lat!}
                  lng={event.location_lng!}
                  locationName={event.location}
                />
              </div>
            )}

            {/* Animated Mascot */}
            {event.mascot_id && (
              <div className="mb-8">
                <AnimatedMascot mascotId={event.mascot_id} />
              </div>
            )}

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-lg w-full max-w-sm"
              >
                CONFIRMAR ASISTENCIA
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur border-t border-slate-200 md:hidden z-30">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-primary/30"
        >
          CONFIRMAR ASISTENCIA
        </button>
      </div>

      {/* RSVP Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center mb-6">
              <div
                className={`mx-auto size-12 rounded-full flex items-center justify-center mb-4 ${theme.bg} ${theme.accent}`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {confirmed ? 'check_circle' : theme.icon}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {confirmed ? '¡Confirmado!' : 'Confirma tu asistencia'}
              </h3>
              <p className="text-slate-500 mt-2">
                {confirmed
                  ? '¡Gracias por confirmar! Te esperamos.'
                  : '¡Nos encantaría que nos acompañaras!'}
              </p>
            </div>

            {!confirmed && (
              <form onSubmit={handleConfirm} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-2"
                    htmlFor="guest-name"
                  >
                    Tu Nombre Completo
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. María González"
                    className="block w-full rounded-xl border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-60"
                  >
                    {loading ? 'Confirmando...' : 'Confirmar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full bg-transparent hover:bg-slate-100 text-slate-600 font-medium py-3 px-4 rounded-full transition-colors"
                  >
                    Quizás más tarde
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
