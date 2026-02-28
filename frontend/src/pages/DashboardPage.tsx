import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { useEventStore } from '@/stores/eventStore'
import { useAuthStore } from '@/stores/authStore'
import type { EventInvitation, Guest } from '@/types'

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  wedding: { bg: 'bg-primary-light', text: 'text-primary', label: 'Boda' },
  birthday: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    label: 'Cumpleaños',
  },
  corporate: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Corporativo' },
  graduation: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: 'Graduación',
  },
  baptism: { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Bautizo' },
  social: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Social' },
  other: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Otro' },
}

const AVATAR_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function EventCard({
  event,
  index,
}: {
  event: EventInvitation
  index: number
}) {
  const [expanded, setExpanded] = useState(index === 0)
  const [guests, setGuests] = useState<Guest[]>([])
  const [copied, setCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()
  const {
    fetchGuestsByEvent,
    guests: storeGuests,
    guestCounts,
    deleteEvent,
  } = useEventStore()

  const style = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES.other
  const confirmedCount =
    guestCounts[event.id] ?? guests.filter((g) => g.confirmed).length

  useEffect(() => {
    if (expanded) {
      fetchGuestsByEvent(event.id)
    }
  }, [expanded, event.id, fetchGuestsByEvent])

  useEffect(() => {
    setGuests(storeGuests.filter((g) => g.event_id === event.id))
  }, [storeGuests, event.id])

  const formatDate = (d: string) => {
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return d
    }
  }

  const formatTime = (t: string) => {
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    return `${String(hour).padStart(2, '0')}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const copyLink = () => {
    const url = `${window.location.origin}/e/${event.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full md:h-auto md:w-1/3 lg:w-1/4">
          <img
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={event.cover_image_url || 'https://via.placeholder.com/400x300'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
          <div className="absolute bottom-4 left-4 text-white md:hidden">
            <span
              className={`rounded-md ${style.bg} ${style.text} px-2 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm`}
            >
              {style.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 hidden md:block">
                <span
                  className={`inline-flex items-center rounded-md ${style.bg} ${style.text} px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide`}
                >
                  {style.label}
                </span>
              </div>
              <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">
                    calendar_today
                  </span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">
                    schedule
                  </span>
                  <span>{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">
                    location_on
                  </span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {confirmedCount}
              </div>
              <div className="text-xs font-medium text-text-muted">
                Confirmados
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyLink}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-background text-text hover:bg-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? '¡Copiado!' : 'Copiar Enlace'}
              </button>
              <button
                onClick={() => navigate(`/edit/${event.id}`)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-background text-text hover:bg-gray-200 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  edit
                </span>
                Editar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  delete
                </span>
                Eliminar
              </button>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all ${
                expanded
                  ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {expanded ? 'expand_less' : 'list'}
              </span>
              {expanded ? 'Ocultar Lista' : 'Abrir Lista'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Guest Table */}
      {expanded && (
        <div className="border-t border-border bg-background/50 p-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="px-6 py-4 font-semibold text-text">
                      Nombre del Invitado
                    </th>
                    <th className="px-6 py-4 font-semibold text-text text-right">
                      Fecha de Confirmación
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {guests
                    .filter((g) => g.confirmed)
                    .map((guest, gIdx) => {
                      const colorIdx = gIdx % AVATAR_COLORS.length
                      const color = AVATAR_COLORS[colorIdx]
                      return (
                        <tr
                          key={guest.id}
                          className="hover:bg-background transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${color.bg} ${color.text} font-bold text-xs`}
                              >
                                {getInitials(guest.full_name)}
                              </div>
                              <span className="font-medium text-text">
                                {guest.full_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-text-muted">
                            {guest.confirmed_at
                              ? new Date(guest.confirmed_at).toLocaleDateString(
                                  'es-ES',
                                )
                              : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  {guests.filter((g) => g.confirmed).length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-8 text-center text-text-muted"
                      >
                        No hay invitados confirmados aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-100">
            <div className="text-center mb-6">
              <div className="mx-auto size-14 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600">
                <span className="material-symbols-outlined text-3xl">
                  warning
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                ¿Eliminar evento?
              </h3>
              <p className="text-slate-500 mt-2 text-sm">
                Esta acción no se puede deshacer. Se eliminarán el evento{' '}
                <strong className="text-slate-700">{event.title}</strong> y
                todos los invitados asociados.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await deleteEvent(event.id)
                  setShowDeleteModal(false)
                }}
                className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { events, fetchEvents } = useEventStore()
  const { user, logout } = useAuthStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const activeCount = events.filter((e) => e.is_active).length

  const filtered = search
    ? events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    : events

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="bg-background text-text min-h-screen flex flex-col antialiased">
      {/* Header with search */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-6 py-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-primary"
          >
            <span className="material-symbols-outlined text-4xl">
              celebration
            </span>
            <h1 className="text-text text-xl font-bold tracking-tight">
              EvenSAX
            </h1>
          </Link>
          <div className="hidden md:flex w-full max-w-sm items-center rounded-xl bg-background px-4 py-2.5">
            <span className="material-symbols-outlined text-text-muted">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-text placeholder-text-muted focus:ring-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link
              to="/create"
              className="hidden sm:flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">
                add
              </span>
              Crear Evento
            </Link>
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

      <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-text md:text-4xl">
                Mis Invitaciones
              </h2>
              <p className="text-text-muted text-lg">
                Gestiona tus eventos y listas de invitados
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-sm text-text-muted bg-white px-3 py-1.5 rounded-xl shadow-sm border border-border">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {activeCount} Activos
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted bg-white px-3 py-1.5 rounded-xl shadow-sm border border-border">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {events.length - activeCount} Finalizado
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <div className="grid gap-6">
            {filtered.map((event, idx) => (
              <EventCard key={event.id} event={event} index={idx} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                <span className="material-symbols-outlined text-5xl mb-4 block">
                  event_busy
                </span>
                <p className="text-lg">
                  {events.length === 0
                    ? 'Aún no has creado ningún evento.'
                    : 'No se encontraron eventos'}
                </p>
                {events.length === 0 && (
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 mt-4 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      add
                    </span>
                    Crear tu primer evento
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
