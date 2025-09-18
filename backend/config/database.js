const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database helper functions
const db = {
  // Users table operations
  users: {
    // Get user by Clerk ID
    async getByClerkId(clerkId) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();
      
      return { data, error };
    },

    // Create new user
    async create(userData) {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();
      
      return { data, error };
    },

    // Update user by Clerk ID
    async updateByClerkId(clerkId, updateData) {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('clerk_id', clerkId)
        .select();
      
      return { data, error };
    },

    // Get user by ID
    async getById(id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    },

    // Get all users (admin only)
    async getAll(limit = 50, offset = 0) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      return { data, error };
    }
  },

  // Companies table operations
  companies: {
    // Create new company with VINSA branding
    async create(companyData) {
      // Automatically add VINSA branding if not present
      if (!companyData.company_name.includes('made by VINSA')) {
        companyData.company_name = `${companyData.company_name} - made by VINSA`;
      }

      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select();
      
      return { data, error };
    },

    // Get company by owner ID
    async getByOwnerId(ownerId) {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          users!companies_owner_id_fkey (
            id,
            clerk_id,
            email,
            full_name,
            mobile_no
          )
        `)
        .eq('owner_id', ownerId)
        .single();
      
      return { data, error };
    },

    // Get company by ID
    async getById(id) {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          users!companies_owner_id_fkey (
            id,
            clerk_id,
            email,
            full_name,
            mobile_no
          )
        `)
        .eq('id', id)
        .single();
      
      return { data, error };
    },

    // Update company
    async update(id, updateData) {
      // Ensure VINSA branding is maintained
      if (updateData.company_name && !updateData.company_name.includes('made by VINSA')) {
        updateData.company_name = `${updateData.company_name} - made by VINSA`;
      }

      const { data, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id)
        .select();
      
      return { data, error };
    },

    // Get all companies (admin only)
    async getAll(limit = 50, offset = 0, filters = {}) {
      let query = supabase
        .from('companies')
        .select(`
          *,
          users!companies_owner_id_fkey (
            id,
            clerk_id,
            email,
            full_name,
            mobile_no
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.verification_status) {
        query = query.eq('verification_status', filters.verification_status);
      }
      if (filters.company_type) {
        query = query.eq('company_type', filters.company_type);
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.state) {
        query = query.ilike('state', `%${filters.state}%`);
      }

      const { data, error } = await query;
      return { data, error };
    },

    // Update verification status (admin only)
    async updateVerificationStatus(id, status, notes = null) {
      const updateData = {
        verification_status: status,
        updated_at: new Date().toISOString()
      };
      
      if (notes) {
        updateData.verification_notes = notes;
      }

      const { data, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id)
        .select();
      
      return { data, error };
    },

    // Search companies
    async search(searchTerm, limit = 20) {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          users!companies_owner_id_fkey (
            id,
            clerk_id,
            email,
            full_name,
            mobile_no
          )
        `)
        .or(`company_name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%`)
        .limit(limit);
      
      return { data, error };
    }
  }
};

module.exports = { supabase, db };