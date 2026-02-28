import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/Header'
import { useEventStore } from '@/stores/eventStore'
import { useAuthStore } from '@/stores/authStore'
import { MascotPicker } from '@/components/MascotPicker'
import { LocationPicker } from '@/components/LocationMap'
import type { EventCategory } from '@/types'

const COLOR_OPTIONS = [
  {
    id: 'blue',
    label: 'Azul',
    value: '#3b82f6',
    bg: 'bg-blue-500',
    ring: 'ring-blue-500',
  },
  {
    id: 'purple',
    label: 'Morado',
    value: '#8b5cf6',
    bg: 'bg-purple-500',
    ring: 'ring-purple-500',
  },
  {
    id: 'rose',
    label: 'Rosa',
    value: '#f43f5e',
    bg: 'bg-rose-500',
    ring: 'ring-rose-500',
  },
  {
    id: 'amber',
    label: 'Ámbar',
    value: '#f59e0b',
    bg: 'bg-amber-500',
    ring: 'ring-amber-500',
  },
  {
    id: 'green',
    label: 'Verde',
    value: '#22c55e',
    bg: 'bg-green-500',
    ring: 'ring-green-500',
  },
  {
    id: 'teal',
    label: 'Turquesa',
    value: '#14b8a6',
    bg: 'bg-teal-500',
    ring: 'ring-teal-500',
  },
  {
    id: 'orange',
    label: 'Naranja',
    value: '#f97316',
    bg: 'bg-orange-500',
    ring: 'ring-orange-500',
  },
  {
    id: 'sky',
    label: 'Celeste',
    value: '#0ea5e9',
    bg: 'bg-sky-500',
    ring: 'ring-sky-500',
  },
]

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    events,
    fetchEvents,
    updateEvent,
    templates,
    loadTemplates,
    loading,
    error,
    clearError,
  } = useEventStore()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLng, setLocationLng] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('classic-elegance')
  const [formError, setFormError] = useState<string | null>(null)
  const [mascotId, setMascotId] = useState<string | null>(null)
  const [customMascotImage, setCustomMascotImage] = useState<string | null>(
    null,
  )
  const [personalImagePreview, setPersonalImagePreview] = useState<
    string | null
  >(null)
  const [customColor, setCustomColor] = useState('blue')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    loadTemplates()
    if (events.length === 0) fetchEvents()
  }, [loadTemplates, fetchEvents, events.length])

  // Populate form when event is found
  useEffect(() => {
    if (initialized || !id || events.length === 0) return
    const event = events.find((e) => e.id === id)
    if (!event) return

    setTitle(event.title)
    setCategory(event.category)
    setDate(event.date)
    setTime(event.time)
    setLocation(event.location)
    setLocationLat(event.location_lat ?? null)
    setLocationLng(event.location_lng ?? null)
    setDescription(event.description ?? '')
    setSelectedTemplate(event.template_id)
    setMascotId(event.mascot_id ?? null)
    setCustomMascotImage(event.mascot_custom_url ?? null)
    setPersonalImagePreview(event.personal_image_url ?? null)

    // Find matching color by hex value
    const matchedColor = COLOR_OPTIONS.find(
      (c) => c.value === event.custom_color,
    )
    setCustomColor(matchedColor?.id ?? 'blue')

    setInitialized(true)
  }, [id, events, initialized])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    clearError()

    if (!user || !id) {
      setFormError('Debes iniciar sesión para editar un evento.')
      return
    }
    if (!category) {
      setFormError('Selecciona una categoría para el evento.')
      return
    }
    if (!title || !date || !time || !location) {
      setFormError('Completa todos los campos obligatorios.')
      return
    }

    const coverUrl =
      templates.find((t) => t.id === selectedTemplate)?.preview_image_url ?? ''

    const mascotCustomUrl =
      mascotId === 'custom' && customMascotImage ? customMascotImage : undefined

    const selectedColorHex =
      COLOR_OPTIONS.find((c) => c.id === customColor)?.value ?? '#3b82f6'

    const result = await updateEvent(id, {
      title,
      category,
      date,
      time,
      location,
      location_lat: locationLat ?? undefined,
      location_lng: locationLng ?? undefined,
      description,
      template_id: selectedTemplate,
      cover_image_url: coverUrl,
      personal_image_url: personalImagePreview ?? undefined,
      mascot_id: mascotId ?? undefined,
      mascot_custom_url: mascotCustomUrl,
      custom_color: selectedColorHex,
    })

    if (result) {
      navigate('/dashboard')
    }
  }

  if (!initialized && events.length > 0 && id) {
    const event = events.find((e) => e.id === id)
    if (!event) {
      return (
        <div className="bg-background min-h-screen flex flex-col text-slate-900 antialiased">
          <AppHeader />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">
                event_busy
              </span>
              <p className="text-lg font-medium">Evento no encontrado</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Volver al Dashboard
              </button>
            </div>
          </main>
        </div>
      )
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col text-slate-900 antialiased">
      <AppHeader />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                Editar Invitación
              </h1>
              <p className="text-slate-500">
                Modifica los detalles de tu evento
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            {/* Error display */}
            {(formError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError || error}
              </div>
            )}

            {/* Event Name */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="event-name"
              >
                Nombre del Evento
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl">
                  celebration
                </span>
                <input
                  id="event-name"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Fiesta de Graduación de Sarah"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary font-medium placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="category"
              >
                Categoría
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl">
                  category
                </span>
                <select
                  id="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full h-14 pl-12 pr-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary font-medium appearance-none transition-all"
                >
                  <option value="" disabled>
                    Selecciona tipo de evento
                  </option>
                  <option value="graduation">Graduación</option>
                  <option value="wedding">Boda</option>
                  <option value="birthday">Cumpleaños</option>
                  <option value="corporate">Corporativo</option>
                  <option value="baptism">Bautizo</option>
                  <option value="social">Reunión Social</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label
                  className="text-sm font-bold text-slate-700"
                  htmlFor="date"
                >
                  Fecha
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl">
                    calendar_today
                  </span>
                  <input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary font-medium transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label
                  className="text-sm font-bold text-slate-700"
                  htmlFor="time"
                >
                  Hora
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl">
                    schedule
                  </span>
                  <input
                    id="time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="location"
              >
                Ubicación
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl">
                  location_on
                </span>
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ingresa el lugar o dirección"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary font-medium placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Location Map Picker */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">
                Ubicación en el Mapa (opcional)
              </span>
              <LocationPicker
                lat={locationLat}
                lng={locationLng}
                onLocationChange={(lat, lng) => {
                  setLocationLat(lat)
                  setLocationLng(lng)
                }}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="description"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agrega un mensaje especial para tus invitados..."
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary font-medium placeholder:text-slate-400 transition-all p-4"
              />
            </div>

            {/* Mascot Picker */}
            <MascotPicker
              selected={mascotId}
              customImage={customMascotImage}
              onSelect={setMascotId}
              onCustomImage={setCustomMascotImage}
            />

            {/* Color Picker */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-slate-700">
                Color del Tema
              </span>
              <p className="text-xs text-slate-400">
                Elige el color principal de tu invitación
              </p>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCustomColor(c.id)}
                    title={c.label}
                    className={`w-10 h-10 rounded-full transition-all ${c.bg} ${
                      customColor === c.id
                        ? `ring-4 ${c.ring} ring-offset-2 scale-110`
                        : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Personal Image Upload */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">
                Imagen Personalizada (opcional)
              </span>
              <p className="text-xs text-slate-400">
                Sube una imagen que aparecerá como portada de tu invitación
              </p>
              {personalImagePreview ? (
                <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={personalImagePreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPersonalImagePreview(null)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-500 rounded-full p-1 shadow-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-slate-50 cursor-pointer transition-all">
                  <span className="material-symbols-outlined text-3xl text-slate-400">
                    add_photo_alternate
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    Haz clic para subir una imagen
                  </span>
                  <span className="text-xs text-slate-400">
                    JPG, PNG o WebP
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () =>
                          setPersonalImagePreview(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Template Selector */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-slate-700">
                Plantilla
              </span>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => {
                  const isSelected = selectedTemplate === template.id
                  return (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
                        isSelected
                          ? 'ring-4 ring-primary ring-offset-2'
                          : 'border border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          alt={template.name}
                          className="w-full h-full object-cover"
                          src={template.preview_image_url}
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              check_circle
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-bold text-slate-900">
                          {template.name}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3.5 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/40 hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
