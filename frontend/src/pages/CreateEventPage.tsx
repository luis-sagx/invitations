import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/Header'
import { useEventStore } from '@/stores/eventStore'
import { useAuthStore } from '@/stores/authStore'
import type { EventCategory } from '@/types'

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { templates, loadTemplates, createEvent, loading } = useEventStore()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('classic-elegance')

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !category) return

    const event = await createEvent({
      user_id: user.id,
      title,
      category,
      date,
      time,
      location,
      description,
      template_id: selectedTemplate,
      cover_image_url: templates.find((t) => t.id === selectedTemplate)
        ?.preview_image_url,
    })

    if (event) {
      navigate('/dashboard')
    }
  }

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
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
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

              {/* Upload Image */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-sm font-bold text-slate-700">
                  Imagen de Portada
                </span>
                <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-2 transition-colors">
                      cloud_upload
                    </span>
                    <p className="text-sm text-slate-500">
                      <span className="font-bold text-primary">
                        Clic para subir
                      </span>{' '}
                      o arrastra y suelta
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </form>
          </div>

          {/* Right Column: Templates */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Elige una Plantilla
              </h3>
              <button className="text-primary text-sm font-bold hover:underline">
                Ver Todas
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
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Guardar Borrador
              </button>
              <button
                onClick={handleSubmit}
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
    </div>
  )
}
