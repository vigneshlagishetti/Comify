import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helpers (no auth functions - Clerk handles authentication)
export const db = {
  // Users table operations
  users: {
    create: async (userData) => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    getByEmail: async (email) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      return { data, error }
    },

    getByClerkId: async (clerkId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    updateByClerkId: async (clerkId, updates) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('clerk_id', clerkId)
        .select()
      return { data, error }
    }
  },

  // Company profile operations
  companies: {
    create: async (companyData) => {
      const { data, error } = await supabase
        .from('company_profile')
        .insert([companyData])
        .select()
      return { data, error }
    },

    getByOwnerId: async (ownerId) => {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .eq('owner_id', ownerId)
        .single()
      return { data, error }
    },

    getByOwnerClerkId: async (clerkId) => {
      // First get the user by clerk_id, then get their company
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single()
      
      if (userError || !user) {
        return { data: null, error: userError || new Error('User not found') }
      }

      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .eq('owner_id', user.id)
        .single()
      
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('company_profile')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    getAll: async () => {
      const { data, error } = await supabase
        .from('company_profile')
        .select(`
          *,
          users:owner_id (
            full_name,
            email,
            mobile_no,
            clerk_id
          )
        `)
      return { data, error }
    }
  }
}