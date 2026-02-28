import { create } from 'zustand'
import type { EventInvitation, Guest, Template } from '@/types'
import { supabase } from '@/lib/supabase'

interface EventState {
  events: EventInvitation[]
  currentEvent: EventInvitation | null
  guests: Guest[]
  guestCounts: Record<string, number> // eventId -> confirmed count
  templates: Template[]
  loading: boolean
  error: string | null

  fetchEvents: () => Promise<void>
  fetchEventBySlug: (slug: string) => Promise<void>
  fetchGuestsByEvent: (eventId: string) => Promise<void>
  fetchGuestCounts: (eventIds: string[]) => Promise<void>
  createEvent: (
    event: Omit<
      EventInvitation,
      'id' | 'created_at' | 'updated_at' | 'slug' | 'is_active'
    > & {
      location_lat?: number
      location_lng?: number
      mascot_id?: string
      mascot_custom_url?: string
    },
  ) => Promise<EventInvitation | null>
  uploadCoverImage: (file: File) => Promise<string | null>
  confirmGuest: (
    eventId: string,
    fullName: string,
    email?: string,
  ) => Promise<boolean>
  loadTemplates: () => void
  setCurrentEvent: (event: EventInvitation | null) => void
  clearError: () => void
}

const DEMO_TEMPLATES: Template[] = [
  {
    id: 'classic-elegance',
    name: 'Elegancia Clásica',
    description:
      'Ideal para bodas, bautizos y eventos formales con un toque sofisticado.',
    preview_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJlQcxvHqXSfTOlnIBOGvW1x1__ph57PQloOB3p-c5EaISVMeyXej-Nn1Kpq0OiCotppdnjZGHj7Hdq5rN8NO8ENKbTgfAAAdSlGRkphuS4BiHgupJHW692Xjp8olWQl0uyhYDDvWU-5pqjY1J6z4E2Gjru6DTLBxvXQKitWEPeXx3wruuoo9JjQPj7vFokYJQa2xmcztOOPKMDKTFBAdWlEdLm6NM0wt0r7MTgQqicGho68OnurMf3wB-5HlsO7RPTkZWCfVHgC1K',
  },
  {
    id: 'neon-party',
    name: 'Fiesta Neon',
    description:
      'Colores vibrantes y energía para cumpleaños y fiestas temáticas.',
    preview_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQjqm3gF8hPSTX5TC6OHBLtIw7dpONUvKm7R7s8Knkl0ndTX2-reis1P6C608f3aCEg-H_LVok66VBNxGg2lHJfb8MB3Hz9jBVigyTnOZ3MpbwqpTVJJYdyK0B8149_q_w7cfdQqZJ2-Ynka5QzKQsooKawcWbrsxJBmRnPCHvp9C2madfAAS00HVPhG31NlSJfa5dZjvk-im8HqiQ-RY-TwlkhkvTtpy_HDL9qi5VFwVFIY99_PgJB_NHNrUVY3TYh9rlSHWzqnC9',
  },
  {
    id: 'minimalist-dark',
    name: 'Profesional Moderno',
    description:
      'Estilo ejecutivo para eventos corporativos, conferencias y graduaciones.',
    preview_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXdCKNWiKM5f4OE1l7W1JZAuaC9E2t0cFCJ9v-jOfwnWPuJz1xtjGnfwGUCHlRRhwQdrKvNKYDuRHaiOtRPwCx9wipbwKxBLBoQZMRYb64VyrjPBNQd6E3TMH20IgZ11iUKk3yWF705y6Tn1Tt6p63BI2WTD9yQXfeLS1_moYBco9MUOdSyYtD6L_GnCPx58EcxyPPXdz7TIZqJ7BAWoeH3q-8LnRWnVYrLSjHnoq7U2JXMmscyPgasMJz6oHof6Hfv16VekCUT8gu',
  },
  {
    id: 'garden-brunch',
    name: 'Jardín & Brunch',
    description:
      'Tonos suaves y naturaleza para reuniones al aire libre y bautizos.',
    preview_image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4nJWc7ztchEm13FzwSH-IohvJ5upY0V27GuWsctzPJwN9-u8T43PREeGzJZsif08wUKkLcswYJLUJagpAff4_nx7oztAJhfhF6WKxiZJa_MPnWBpVCax0oN5p8IXFA7thpMIojGOks2gXS4QsP8SHffvJ292g3T9_vJ7XwVnjyZebhcX7QbELRh-a3JfbbZszY2th-tG3AEjYsEes6q_Hqe7oV9kGLm-_34eNon44CSsRsC3WIIjrid7o09T4GaBl6TKRTxURIZBK',
  },
]

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  guests: [],
  guestCounts: {},
  templates: [],
  loading: false,
  error: null,

  loadTemplates: () => {
    set({ templates: DEMO_TEMPLATES })
  },

  fetchEvents: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const events = data ?? []
      set({ events, loading: false })

      // Eagerly fetch guest counts for all events
      if (events.length > 0) {
        get().fetchGuestCounts(events.map((e) => e.id))
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  fetchEventBySlug: async (slug) => {
    set({ loading: true, error: null, currentEvent: null })
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      set({ currentEvent: data, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false, currentEvent: null })
    }
  },

  fetchGuestsByEvent: async (eventId) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('confirmed_at', { ascending: false })

      if (error) throw error
      set({ guests: data ?? [], loading: false })

      // Also update the count for this event
      const confirmed = (data ?? []).filter((g) => g.confirmed).length
      set((state) => ({
        guestCounts: { ...state.guestCounts, [eventId]: confirmed },
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  fetchGuestCounts: async (eventIds) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('event_id, confirmed')
        .in('event_id', eventIds)
        .eq('confirmed', true)

      if (error) throw error

      const counts: Record<string, number> = {}
      for (const id of eventIds) counts[id] = 0
      for (const row of data ?? []) {
        counts[row.event_id] = (counts[row.event_id] || 0) + 1
      }
      set({ guestCounts: counts })
    } catch {
      // silently fail – counts are non-critical
    }
  },

  createEvent: async (event) => {
    set({ loading: true, error: null })
    try {
      const slug =
        event.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now().toString(36)

      const { data, error } = await supabase
        .from('events')
        .insert({ ...event, slug, is_active: true })
        .select()
        .single()

      if (error) throw error
      set((state) => ({
        events: [data, ...state.events],
        loading: false,
      }))
      return data
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      return null
    }
  },

  uploadCoverImage: async (file: File) => {
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err) {
      set({ error: (err as Error).message })
      return null
    }
  },

  confirmGuest: async (eventId, fullName, email) => {
    try {
      const { error } = await supabase.from('guests').insert({
        event_id: eventId,
        full_name: fullName,
        email: email || null,
        confirmed: true,
        confirmed_at: new Date().toISOString(),
      })

      if (error) throw error

      // Refresh guest list for the event
      await get().fetchGuestsByEvent(eventId)
      return true
    } catch (err) {
      set({ error: (err as Error).message })
      return false
    }
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),
  clearError: () => set({ error: null }),
}))
