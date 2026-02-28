export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'graduation'
  | 'social'
  | 'baptism'
  | 'other'

export interface EventInvitation {
  id: string
  user_id: string
  title: string
  category: EventCategory
  date: string
  time: string
  location: string
  location_lat?: number
  location_lng?: number
  description?: string
  cover_image_url?: string
  personal_image_url?: string
  mascot_id?: string
  mascot_custom_url?: string
  custom_color?: string
  template_id: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  event_id: string
  full_name: string
  email?: string
  confirmed: boolean
  confirmed_at?: string
  created_at: string
}

export interface Template {
  id: string
  name: string
  description: string
  preview_image_url: string
}
