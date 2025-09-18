-- Company Registration & Verification Module Database Schema
-- This SQL file creates the necessary tables for the Supabase database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    signup_type VARCHAR(1) NOT NULL DEFAULT 'e', -- 'e' for email
    gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f', 'o')), -- male, female, other
    mobile_no VARCHAR(20) NOT NULL UNIQUE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company profile table
CREATE TABLE IF NOT EXISTS public.company_profile (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) NOT NULL,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT NOT NULL,
    founded_date DATE,
    description TEXT,
    social_links JSONB DEFAULT '{}',
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

-- Row Level Security (RLS) policies

-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Company profile policies
CREATE POLICY "Users can view their own company profile" ON public.company_profile
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own company profile" ON public.company_profile
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own company profile" ON public.company_profile
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own company profile" ON public.company_profile
    FOR DELETE USING (auth.uid() = owner_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile_no ON public.users(mobile_no);
CREATE INDEX IF NOT EXISTS idx_company_profile_owner_id ON public.company_profile(owner_id);
CREATE INDEX IF NOT EXISTS idx_company_profile_company_name ON public.company_profile(company_name);
CREATE INDEX IF NOT EXISTS idx_company_profile_industry ON public.company_profile(industry);

-- Function to handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, signup_type, gender, mobile_no)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'signup_type', 'e'),
        COALESCE(NEW.raw_user_meta_data->>'gender', 'm'),
        COALESCE(NEW.raw_user_meta_data->>'mobile_no', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile when auth user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data (optional - for testing)
-- INSERT INTO public.users (id, email, full_name, signup_type, gender, mobile_no, is_email_verified, is_mobile_verified)
-- VALUES (
--     uuid_generate_v4(),
--     'demo@company.com',
--     'Demo User',
--     'e',
--     'm',
--     '+919876543210',
--     TRUE,
--     TRUE
-- );

-- Views for easier querying
CREATE OR REPLACE VIEW public.company_profiles_with_users AS
SELECT 
    cp.*,
    u.email as owner_email,
    u.full_name as owner_name,
    u.mobile_no as owner_mobile,
    u.is_email_verified,
    u.is_mobile_verified
FROM public.company_profile cp
JOIN public.users u ON cp.owner_id = u.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;