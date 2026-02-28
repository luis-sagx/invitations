import { useState, useEffect, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { PublicHeader } from '@/components/Header'
import { useEventStore } from '@/stores/eventStore'

export default function PublicInvitationPage() {
  const { slug } = useParams<{ slug: string }>()
  const { currentEvent, fetchEventBySlug, confirmGuest, loading } =
    useEventStore()
  const [showModal, setShowModal] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchEventBySlug(slug)
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

  // Use demo data if no event loaded from Supabase
  const event = currentEvent ?? {
    title: 'Bautizo de Sofia',
    category: 'baptism' as const,
    date: '2024-10-24',
    time: '10:00',
    location: 'Parroquia San Francisco',
    description:
      'Con mucha alegría te invitamos a celebrar este momento tan especial en la vida de nuestra pequeña.',
    cover_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXl4ZQF4pSuhzdy7ai1hK2Yj6DBGYlHbQn17YR64V7nPguCGai-AXP0Mi9n74HzkoBUO7QazrGemd3dhfNMNWNVxX0tWdUot9xUTlLwfrBycZ-zMjZsrONWYwhf7bYkB-5QCQmVeSq3bVzG8I0Cjk9VLFr5yEhRPik7spxSahaCCZv6dntx4vETFGu3y2GaqeA4RFbl-K67LFSibAWvLMF5sJXD6mTnhq2QTlEsq7IyrqaYMjmIuKvzxUY869BsTqfPN1w21yXzvtC',
    id: 'demo',
  }

  const categoryLabels: Record<string, string> = {
    wedding: 'Boda',
    birthday: 'Cumpleaños',
    corporate: 'Corporativo',
    graduation: 'Graduación',
    baptism: 'Bautizo',
    social: 'Social',
    other: 'Otro',
  }

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

  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden text-slate-900 antialiased">
      <PublicHeader variant="public" />

      <main className="flex flex-col items-center justify-center w-full py-10 px-4 pb-24 md:pb-10 relative">
        {/* Decorations */}
        <div className="absolute top-20 left-10 text-primary/20 pointer-events-none select-none hidden lg:block">
          <span className="material-symbols-outlined text-6xl rotate-12">
            local_florist
          </span>
        </div>
        <div className="absolute top-40 right-20 text-primary/10 pointer-events-none select-none hidden lg:block">
          <span className="material-symbols-outlined text-8xl -rotate-12">
            favorite
          </span>
        </div>
        <div className="absolute bottom-40 left-20 text-primary/10 pointer-events-none select-none hidden lg:block">
          <span className="material-symbols-outlined text-7xl rotate-45">
            star
          </span>
        </div>

        {/* Invitation Card */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10">
          {/* Hero Image */}
          <div className="w-full aspect-[21/9] bg-slate-200 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${event.cover_image_url}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                {categoryLabels[event.category] || event.category}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {event.title}
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto mb-8 font-medium">
              {event.description}
            </p>

            {/* Event Info Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-left md:text-center">
              <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
              <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Hora</p>
                  <p className="text-sm text-slate-500">
                    {formatTime(event.time)}
                  </p>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Lugar</p>
                  <p className="text-sm text-slate-500">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-slate-200">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOAZp32OMr1defLGjcYXXmPOnPocoIGdve-XfWxg69x7znLPECVFmqrQaFm4fdprGRAF9Bk92X2CrQ-78qoJw4-ixPysiV0to36sLStuCyCIBOZ9MqYkmEs1PyZklWcduvIktDGzDkBErGgAadaOpGBA-n60o6vZeOKMKllZ7YypIXfe0y_PJsjYUwNNxbi7RXc5CIg4g1yvBMKqLGjNrgiZ30Uvf3wkucp_1gF4DFQrwqoVRsgHydUfB6aX6T_pY8LMBjFhXOfbiV')`,
                }}
              />
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">
                  directions
                </span>
                Ver Mapa
              </div>
            </div>

            <p className="text-slate-600 italic mb-10">
              "Te esperamos para compartir un almuerzo después de la ceremonia
              en el Jardín Los Olivos."
            </p>

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
              <div className="mx-auto size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-2xl">
                  {confirmed ? 'check_circle' : 'check_circle'}
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
