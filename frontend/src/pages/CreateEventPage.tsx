import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/Header'
import { useEventStore } from '@/stores/eventStore'
import { useAuthStore } from '@/stores/authStore'
import { MascotPicker } from '@/components/MascotPicker'
import { LocationPicker } from '@/components/LocationMap'
import { AnimatedMascot } from '@/components/AnimatedMascot'
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

const CATEGORY_THEMES: Record<
  string,
  { icon: string; accent: string; gradient: string; label: string }
> = {
  wedding: {
    icon: 'favorite',
    accent: 'text-rose-600',
    gradient: 'from-rose-400/30 to-pink-300/20',
    label: 'Boda',
  },
  birthday: {
    icon: 'cake',
    accent: 'text-purple-600',
    gradient: 'from-purple-400/30 to-indigo-300/20',
    label: 'Cumpleaños',
  },
  corporate: {
    icon: 'business_center',
    accent: 'text-blue-600',
    gradient: 'from-blue-500/30 to-cyan-300/20',
    label: 'Corporativo',
  },
  graduation: {
    icon: 'school',
    accent: 'text-green-600',
    gradient: 'from-green-400/30 to-emerald-300/20',
    label: 'Graduación',
  },
  baptism: {
    icon: 'water_drop',
    accent: 'text-sky-600',
    gradient: 'from-sky-300/30 to-blue-200/20',
    label: 'Bautizo',
  },
  social: {
    icon: 'groups',
    accent: 'text-amber-600',
    gradient: 'from-amber-400/30 to-orange-300/20',
    label: 'Social',
  },
}

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { templates, loadTemplates, createEvent, loading, error, clearError } =
    useEventStore()

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
  const [showPreview, setShowPreview] = useState(false)
  const [mascotId, setMascotId] = useState<string | null>(null)
  const [customMascotImage, setCustomMascotImage] = useState<string | null>(
    null,
  )
  const [personalImagePreview, setPersonalImagePreview] = useState<
    string | null
  >(null)
  const [customColor, setCustomColor] = useState('blue')

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    clearError()

    if (!user) {
      setFormError('Debes iniciar sesión para crear un evento.')
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

    // Custom mascot: store data URL directly
    const mascotCustomUrl =
      mascotId === 'custom' && customMascotImage ? customMascotImage : undefined

    const selectedColor =
      COLOR_OPTIONS.find((c) => c.id === customColor)?.value ?? '#3b82f6'

    const event = await createEvent({
      user_id: user.id,
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
      custom_color: selectedColor,
    })

    if (event) {
      navigate('/dashboard')
    }
  }

  const formatDatePreview = (d: string) => {
    if (!d) return 'Fecha del evento'
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    } catch {
      return d
    }
  }

  const formatTimePreview = (t: string) => {
    if (!t) return 'Hora'
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${m} ${ampm}`
  }

  const catTheme = category
    ? (CATEGORY_THEMES[category] ?? CATEGORY_THEMES.social)
    : null

  const selectedColorHex =
    COLOR_OPTIONS.find((c) => c.id === customColor)?.value ?? '#3b82f6'
  const templateUrl =
    templates.find((t) => t.id === selectedTemplate)?.preview_image_url ?? ''

  return (
    <div className="bg-background min-h-screen flex flex-col text-slate-900 antialiased">
      <AppHeader />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                Crear Invitación
              </h1>
              <p className="text-slate-500 text-lg">
                Ingresa los detalles de tu evento y elige un estilo para lanzar
                tu sitio.
              </p>
            </div>

            <form
              id="create-event-form"
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
                    onChange={(e) =>
                      setCategory(e.target.value as EventCategory)
                    }
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
                      onClick={() => {
                        setPersonalImagePreview(null)
                      }}
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
            </form>
          </div>

          {/* Right Column: Templates */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Elige una Plantilla
              </h3>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={!title}
                className="inline-flex items-center gap-1.5 text-primary text-sm font-bold hover:underline disabled:opacity-40 disabled:no-underline"
              >
                <span className="material-symbols-outlined text-lg">
                  visibility
                </span>
                Vista Previa
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {templates.map((template) => {
                const isSelected = selectedTemplate === template.id
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group cursor-pointer relative rounded-2xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'ring-4 ring-primary ring-offset-4 ring-offset-background'
                        : 'border border-slate-200 hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    <div className="aspect-[4/5] w-full relative">
                      <img
                        alt={template.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          !isSelected ? 'group-hover:scale-105' : ''
                        }`}
                        src={template.preview_image_url}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${
                          isSelected
                            ? 'opacity-60'
                            : 'opacity-0 group-hover:opacity-60'
                        } transition-opacity duration-300`}
                      />
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                          Seleccionado
                        </div>
                      )}
                      {!isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg">
                            Seleccionar
                          </span>
                        </div>
                      )}
                      <div
                        className={`absolute bottom-0 left-0 right-0 p-6 ${
                          isSelected
                            ? ''
                            : 'translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100'
                        } transition-all duration-300`}
                      >
                        <h4 className="text-white font-bold text-xl mb-1">
                          {template.name}
                        </h4>
                        <p className="text-slate-200 text-sm">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-slate-200 backdrop-blur lg:relative lg:bg-transparent lg:border-none lg:backdrop-blur-none lg:p-0 mt-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm">
              <span className="material-symbols-outlined text-base">info</span>
              <p>Tu invitación se guardará como borrador automáticamente.</p>
            </div>
            <div className="flex w-full sm:w-auto gap-4">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={!title}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-40 inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">
                  visibility
                </span>
                Vista Previa
              </button>
              <button
                type="submit"
                form="create-event-form"
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/40 hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-xl">
                  rocket_launch
                </span>
                Generar Sitio
              </button>
            </div>
          </div>
        </div>
        <div className="h-24 lg:hidden" />
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-slate-500 rounded-full p-1.5 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Preview Card */}
            <div className="w-full aspect-[21/9] bg-slate-200 relative overflow-hidden">
              {/* Template image: blurred bg when personal image exists, normal otherwise */}
              <div
                className={`absolute inset-0 bg-cover bg-center ${personalImagePreview ? 'blur-sm scale-105 opacity-60' : ''}`}
                style={{ backgroundImage: `url('${templateUrl}')` }}
              />
              {/* Personal image on top (shown clearly) */}
              {personalImagePreview && (
                <img
                  src={personalImagePreview}
                  alt="Imagen personal"
                  className="absolute inset-0 w-full h-full object-cover z-[1]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8 z-[2]">
                {catTheme && (
                  <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">
                      {catTheme.icon}
                    </span>
                    {catTheme.label}
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {title || 'Nombre del Evento'}
              </h2>
              {description && (
                <p className="text-slate-600 max-w-md mx-auto mb-6 font-medium">
                  {description}
                </p>
              )}

              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div
                    className="size-8 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: `${selectedColorHex}20`,
                      color: selectedColorHex,
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">
                      calendar_month
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">Fecha</p>
                  <p className="text-xs text-slate-500 capitalize">
                    {formatDatePreview(date)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div
                    className="size-8 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: `${selectedColorHex}20`,
                      color: selectedColorHex,
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">
                      schedule
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">Hora</p>
                  <p className="text-xs text-slate-500">
                    {formatTimePreview(time)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div
                    className="size-8 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: `${selectedColorHex}20`,
                      color: selectedColorHex,
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">
                      location_on
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">Lugar</p>
                  <p className="text-xs text-slate-500">
                    {location || 'Ubicación'}
                  </p>
                </div>
              </div>

              {/* Mascot preview */}
              {mascotId && (
                <div className="mb-6">
                  <AnimatedMascot
                    mascotId={mascotId}
                    customImageUrl={customMascotImage ?? undefined}
                  />
                </div>
              )}

              <button
                type="button"
                className="text-white font-bold py-3 px-8 rounded-full text-base cursor-default"
                style={{
                  backgroundColor: selectedColorHex,
                  boxShadow: `0 10px 15px -3px ${selectedColorHex}40`,
                }}
              >
                CONFIRMAR ASISTENCIA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
