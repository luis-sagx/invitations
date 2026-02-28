import { create } from 'zustand'
import type { User } from '@/types'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
          },
          loading: false,
        })
      } else {
        set({ user: null, loading: false })
      }
    } catch {
      set({ user: null, loading: false })
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email ?? '',
            full_name: data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
            created_at: data.user.created_at,
          },
          loading: false,
        })
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw error
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email ?? '',
            full_name: fullName,
            created_at: data.user.created_at,
          },
          loading: false,
        })
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))
