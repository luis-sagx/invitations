import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Footer } from '@/components/Footer'
import { useEventStore } from '@/stores/eventStore'
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

// Demo data while Supabase isn't connected
const DEMO_EVENTS: EventInvitation[] = [
  {
    id: '1',
    user_id: 'demo',
    title: 'Boda de María y Juan',
    category: 'wedding',
    date: '2023-10-15',
    time: '18:00',
    location: 'Hacienda San Miguel',
    slug: 'boda-maria-juan',
    template_id: 'classic-elegance',
    is_active: true,
    cover_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCIiXUt2ZqzYvP9s58zJ2igmO9xCaU1EpTLOyOJ1yla5eHcWvrhWFpdP3prHdR8NN6ivJCR24q6T171-jAOThDQNZMQAKtaHWwldMEL10Kix8OfeyHpf_zkyr9k5o1zWIz7T_psDjhYUdcfF0xzP9i_vBf72XnbkjdrImXm2LBL8AqUJ57hxx0HsLWGKjYJaulF_mYxU0rQUft7gOjxkgiDgoesY4iehebKkJVHCZ_xxMvKQSGploz5a1riUORMQntrg8Y0Cwp2FJI',
    created_at: '2023-09-01',
    updated_at: '2023-09-01',
  },
  {
    id: '2',
    user_id: 'demo',
    title: 'Cumpleaños 30 de Laura',
    category: 'birthday',
    date: '2023-11-20',
    time: '20:00',
    location: 'Rooftop Bar',
    slug: 'cumple-laura-30',
    template_id: 'neon-party',
    is_active: true,
    cover_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCewAMvSZVIttrSKdt-ojZjWoE4jYflY84U6yjeZyaSoP0hQd7ipjn9C513_41xe1zdqjZOTyHUs-EAT0ywXfUidN20yNjFdZvWvY8y104SwxWiy_OBqCCJMIaTkAlS0VZ9vxoiJEnJobHSN3adUQ01oId_jGu-dGRZRrrS4qJGPDZNU-zYCGF8Q8SniSrp9CUdLhkQHIYuwcoC-vOttEtQJ3uqTHMAgXsY2bf5uNRioTzHEAv5OkUcw4ZKG-dJzejuT2lVdL-HcspP',
    created_at: '2023-09-15',
    updated_at: '2023-09-15',
  },
  {
    id: '3',
    user_id: 'demo',
    title: 'Lanzamiento de Producto 2024',
    category: 'corporate',
    date: '2023-12-05',
    time: '09:00',
    location: 'Centro de Convenciones',
    slug: 'lanzamiento-producto-2024',
    template_id: 'minimalist-dark',
    is_active: true,
    cover_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMaWQo7aP6cdd7SN7np4HhKPZ9RitpTjEWE6FEshbfnuqvTm4ZBtmQVPrbaFOcnSazD4o2wW29MWZnOUr-q_N6vuazcKw6hKAFHgJgREXsL5bcKazjzXo_pEOkjiWB0XmndGgNrxuEf4G6PRNqeecHtAjQd1xNGWXl0ViD32vjcfY5FG3PXaCdfGa6LFIENJzSG2OfP9T-Y226dLZZxYVWmR9XsDYMCv1uDNJKwP9EpkMvPa7s3EHMT2F13twYjSKn5MOXM0Iyw5je',
    created_at: '2023-10-01',
    updated_at: '2023-10-01',
  },
]

const DEMO_GUESTS: Record<string, Guest[]> = {
  '1': [
    {
      id: 'g1',
      event_id: '1',
      full_name: 'Carlos Ruiz',
      email: 'carlos.ruiz@example.com',
      confirmed: true,
      confirmed_at: '2023-09-12',
      created_at: '2023-09-12',
    },
    {
      id: 'g2',
      event_id: '1',
      full_name: 'Ana Gómez',
      email: 'ana.gomez@example.com',
      confirmed: true,
      confirmed_at: '2023-09-13',
      created_at: '2023-09-13',
    },
    {
      id: 'g3',
      event_id: '1',
      full_name: 'Pedro Martínez',
      email: 'pedro.mtz@example.com',
      confirmed: true,
      confirmed_at: '2023-09-14',
      created_at: '2023-09-14',
    },
    {
      id: 'g4',
      event_id: '1',
      full_name: 'Lucia Santos',
      email: 'lucia.s@example.com',
      confirmed: true,
      confirmed_at: '2023-09-15',
      created_at: '2023-09-15',
    },
  ],
}

const DEMO_CONFIRMED_COUNT: Record<string, number> = {
  '1': 45,
  '2': 12,
  '3': 89,
}

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
  const { fetchGuestsByEvent, guests: storeGuests } = useEventStore()

  const style = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES.other
  const confirmedCount =
    DEMO_CONFIRMED_COUNT[event.id] ??
    storeGuests.filter((g) => g.event_id === event.id && g.confirmed).length

  useEffect(() => {
    if (expanded) {
      if (DEMO_GUESTS[event.id]) {
        setGuests(DEMO_GUESTS[event.id])
      } else {
        fetchGuestsByEvent(event.id)
      }
    }
  }, [expanded, event.id, fetchGuestsByEvent])

  useEffect(() => {
    if (!DEMO_GUESTS[event.id]) {
      setGuests(storeGuests.filter((g) => g.event_id === event.id))
    }
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
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-semibold text-text hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                content_copy
              </span>
              Copiar Enlace
            </button>
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
                    <th className="px-6 py-4 font-semibold text-text">Email</th>
                    <th className="px-6 py-4 font-semibold text-text text-right">
                      Fecha de Confirmación
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {guests.map((guest, gIdx) => {
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
                        <td className="px-6 py-4 text-text-muted">
                          {guest.email || '-'}
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
                  {guests.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-text-muted"
                      >
                        No hay invitados confirmados aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {guests.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-border flex justify-center">
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  Ver todos los invitados
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { events, fetchEvents } = useEventStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Use demo events if no events from Supabase
  const displayEvents = events.length > 0 ? events : DEMO_EVENTS
  const activeCount = displayEvents.filter((e) => e.is_active).length

  const filtered = search
    ? displayEvents.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()),
      )
    : displayEvents

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
              Eventos
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
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <a
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              href="#"
            >
              Configuración
            </a>
          </nav>
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
                Gestiona tus eventos activos y listas de invitados
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-sm text-text-muted bg-white px-3 py-1.5 rounded-xl shadow-sm border border-border">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {activeCount} Activos
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted bg-white px-3 py-1.5 rounded-xl shadow-sm border border-border">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {displayEvents.length - activeCount} Finalizado
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
                <p className="text-lg">No se encontraron eventos</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
