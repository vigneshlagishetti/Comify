-- Language: PostgreSQL
-- Database: Supabase
-- Company Registration & Verification Module Database Schema for Clerk Auth
-- This SQL file creates the necessary tables for the Supabase database with Clerk integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for Clerk authenticated users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_id VARCHAR(255) NOT NULL UNIQUE, -- Clerk user ID
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    mobile_no VARCHAR(20),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company profile table
CREATE TABLE IF NOT EXISTS public.company_profile (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) NOT NULL,
    company_name TEXT NOT NULL,
    company_type VARCHAR(50) NOT NULL CHECK (company_type IN ('private_limited', 'public_limited', 'partnership', 'sole_proprietorship', 'llp')),
    industry TEXT NOT NULL,
    employee_count VARCHAR(20) CHECK (employee_count IN ('1-10', '11-50', '51-200', '201-500', '500+')),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    company_description TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatically updating updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profile_updated_at 
    BEFORE UPDATE ON public.company_profile 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Since we're using Clerk for authentication, we don't need RLS based on auth.uid()
-- Instead, we'll handle authorization in the application layer

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile_no ON public.users(mobile_no);
CREATE INDEX IF NOT EXISTS idx_company_profile_owner_id ON public.company_profile(owner_id);
CREATE INDEX IF NOT EXISTS idx_company_profile_company_name ON public.company_profile(company_name);
CREATE INDEX IF NOT EXISTS idx_company_profile_industry ON public.company_profile(industry);
CREATE INDEX IF NOT EXISTS idx_company_profile_verification_status ON public.company_profile(verification_status);

-- Views for easier querying
CREATE OR REPLACE VIEW public.company_profiles_with_users AS
SELECT 
    cp.*,
    u.email as owner_email,
    u.full_name as owner_name,
    u.mobile_no as owner_mobile,
    u.clerk_id as owner_clerk_id
FROM public.company_profile cp
JOIN public.users u ON cp.owner_id = u.id;

-- Grant necessary permissions (adjust based on your security requirements)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;