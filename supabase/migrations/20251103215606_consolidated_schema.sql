-- Consolidated Migration: Current Database Schema State
-- This migration consolidates all previous migrations into a single file
-- Created: 2025-11-03
-- This represents the current state of the database schema

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Admin Accounts Table
CREATE TABLE IF NOT EXISTS public.admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.admin_accounts(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    revoked_at TIMESTAMPTZ
);

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    country TEXT,
    city TEXT,
    currency TEXT DEFAULT 'USD' CHECK (currency = ANY (ARRAY['USD', 'INR', 'EUR'])),
    profile_picture TEXT,
    wallet_balance NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    referral_code TEXT UNIQUE,
    referred_by UUID,
    referral_link TEXT,
    date_of_birth DATE,
    gender TEXT,
    occupation TEXT,
    preferences JSONB NOT NULL DEFAULT '{}',
    terms_accepted BOOLEAN DEFAULT false,
    privacy_accepted BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    reward_points INTEGER DEFAULT 0
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    city TEXT,
    currency TEXT DEFAULT 'USD',
    profile_picture TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    reward_points INTEGER DEFAULT 0
);

-- Expert Accounts Table
CREATE TABLE IF NOT EXISTS public.expert_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    specialization TEXT,
    experience TEXT,
    bio TEXT,
    certificate_urls TEXT[] NOT NULL DEFAULT '{}',
    profile_picture TEXT,
    selected_services INTEGER[] NOT NULL DEFAULT '{}',
    average_rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'approved', 'disapproved'])),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID,
    category TEXT CHECK (category = ANY (ARRAY['listening-volunteer', 'listening-expert', 'listening-coach', 'mindfulness-expert'])),
    onboarding_completed BOOLEAN DEFAULT false,
    pricing_set BOOLEAN DEFAULT false,
    availability_set BOOLEAN DEFAULT false,
    profile_completed BOOLEAN DEFAULT false,
    languages TEXT[] NOT NULL DEFAULT '{}'
);

-- Expert Presence Table
CREATE TABLE IF NOT EXISTS public.expert_presence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    status TEXT NOT NULL CHECK (status = ANY (ARRAY['available', 'busy', 'away', 'offline'])),
    accepting_calls BOOLEAN NOT NULL DEFAULT true,
    last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expert Availabilities Table
CREATE TABLE IF NOT EXISTS public.expert_availabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expert Pricing Tiers Table
CREATE TABLE IF NOT EXISTS public.expert_pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    category TEXT NOT NULL,
    session_30_inr NUMERIC DEFAULT 0,
    session_30_eur NUMERIC DEFAULT 0,
    session_60_inr NUMERIC DEFAULT 0,
    session_60_eur NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expert Services Table
CREATE TABLE IF NOT EXISTS public.expert_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    service_id INTEGER NOT NULL REFERENCES public.services(id),
    admin_assigned_rate_inr NUMERIC,
    admin_assigned_rate_usd NUMERIC,
    assigned_at TIMESTAMPTZ,
    assigned_by TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expert Service Specializations Table
CREATE TABLE IF NOT EXISTS public.expert_service_specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    service_id INTEGER NOT NULL REFERENCES public.services(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_available BOOLEAN DEFAULT true,
    is_primary_service BOOLEAN DEFAULT false,
    proficiency_level TEXT DEFAULT 'intermediate'
);

-- Expert Categories Table
CREATE TABLE IF NOT EXISTS public.expert_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price_usd NUMERIC DEFAULT 0,
    base_price_inr NUMERIC DEFAULT 0,
    base_price_eur NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Expert Approval Notifications Table
CREATE TABLE IF NOT EXISTS public.expert_approval_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type = ANY (ARRAY['approval', 'rejection'])),
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Expert Away Messages Table
CREATE TABLE IF NOT EXISTS public.expert_away_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ
);

-- Expert User Reports Table
CREATE TABLE IF NOT EXISTS public.expert_user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL,
    reported_user_id UUID,
    reported_user_email TEXT,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    description TEXT,
    rate_usd NUMERIC NOT NULL,
    rate_inr NUMERIC NOT NULL,
    rate_eur NUMERIC DEFAULT 0,
    category TEXT,
    duration INTEGER DEFAULT 60,
    featured BOOLEAN DEFAULT false
);

-- Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    sessions INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT CHECK (category = ANY (ARRAY['quick-ease', 'resilience-building', 'super-human', 'issue-based'])),
    created_at TIMESTAMPTZ DEFAULT now(),
    enrollments INTEGER DEFAULT 0,
    programtype TEXT DEFAULT 'wellness'
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    expert_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    duration INTEGER NOT NULL,
    status TEXT CHECK (status = ANY (ARRAY['scheduled', 'completed', 'cancelled'])),
    service_id INTEGER REFERENCES public.services(id),
    notes TEXT,
    channel_name TEXT,
    token TEXT,
    uid INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    start_time TIME,
    end_time TIME,
    google_calendar_event_id TEXT,
    user_calendar_event_id TEXT,
    time_slot_id UUID,
    reminder_sent BOOLEAN DEFAULT false,
    payment_status TEXT DEFAULT 'pending',
    razorpay_payment_id TEXT
);

-- Call Sessions Table
CREATE TABLE IF NOT EXISTS public.call_sessions (
    id TEXT PRIMARY KEY,
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    channel_name TEXT NOT NULL,
    call_type TEXT CHECK (call_type = ANY (ARRAY['audio', 'video'])),
    status TEXT DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'active', 'ended', 'failed'])),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration INTEGER,
    cost NUMERIC,
    currency TEXT DEFAULT 'USD' CHECK (currency = ANY (ARRAY['USD', 'INR'])),
    selected_duration INTEGER,
    pricing_tier TEXT DEFAULT 'standard',
    payment_method TEXT CHECK (payment_method = ANY (ARRAY['wallet', 'gateway'])),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    recording_url TEXT,
    analytics_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expert_category TEXT,
    cost_eur NUMERIC DEFAULT 0,
    appointment_id UUID REFERENCES public.appointments(id),
    call_direction VARCHAR DEFAULT 'outgoing' CHECK (call_direction::text = ANY (ARRAY['incoming', 'outgoing'])),
    expert_auth_id UUID REFERENCES auth.users(id),
    missed_call BOOLEAN DEFAULT false,
    answered_at TIMESTAMPTZ,
    call_metadata JSONB NOT NULL DEFAULT '{}',
    agora_channel_name VARCHAR,
    agora_token TEXT,
    payment_status TEXT DEFAULT 'pending',
    razorpay_payment_id TEXT,
    failure_reason TEXT
);

-- Incoming Call Requests Table
CREATE TABLE IF NOT EXISTS public.incoming_call_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    call_type VARCHAR NOT NULL CHECK (call_type::text = ANY (ARRAY['audio', 'video'])),
    status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status::text = ANY (ARRAY['pending', 'accepted', 'declined', 'timeout', 'cancelled'])),
    channel_name VARCHAR NOT NULL,
    agora_token TEXT,
    agora_uid INTEGER,
    estimated_cost_eur NUMERIC,
    estimated_cost_inr NUMERIC,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    call_session_id TEXT REFERENCES public.call_sessions(id),
    user_metadata JSONB DEFAULT '{}'
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    receiver_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    sender_id UUID REFERENCES auth.users(id),
    reference_id UUID,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    active BOOLEAN DEFAULT true
);

-- Referral Settings Table
CREATE TABLE IF NOT EXISTS public.referral_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_enabled BOOLEAN NOT NULL DEFAULT false,
    reward_amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'INR',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id),
    referred_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    reward_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- Support Requests Table
CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    admin_notes TEXT,
    resolved_at TIMESTAMPTZ
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    date TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Expert Services Table
CREATE TABLE IF NOT EXISTS public.user_expert_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id),
    service_id INTEGER NOT NULL REFERENCES public.services(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Favorite Programs Table
CREATE TABLE IF NOT EXISTS public.user_favorite_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    program_id INTEGER NOT NULL REFERENCES public.programs(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id)
);

-- User Reviews Table
CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    date TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    expert_id UUID REFERENCES public.expert_accounts(auth_id),
    expert_name TEXT,
    user_name TEXT
);

-- Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscriber_number INTEGER NOT NULL,
    honeypot TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_revoked_at ON public.admin_sessions(revoked_at);
CREATE INDEX IF NOT EXISTS idx_expert_presence_expert_id ON public.expert_presence(expert_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_expert_id ON public.call_sessions(expert_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_user_id ON public.call_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_incoming_call_requests_expert_id ON public.incoming_call_requests(expert_id);
CREATE INDEX IF NOT EXISTS idx_incoming_call_requests_user_id ON public.incoming_call_requests(user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Admin Functions
CREATE OR REPLACE FUNCTION public.authenticate_admin(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
    admin_record RECORD;
    result JSON;
BEGIN
    SELECT id, username, email, role, password_hash, is_active, failed_login_attempts, locked_until
    INTO admin_record
    FROM public.admin_accounts
    WHERE username = p_username AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid credentials'
        );
    END IF;
    
    IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > NOW() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Account is temporarily locked'
        );
    END IF;
    
    IF NOT (admin_record.password_hash = crypt(p_password, admin_record.password_hash)) THEN
        UPDATE public.admin_accounts 
        SET failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
                WHEN failed_login_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
                ELSE NULL
            END
        WHERE id = admin_record.id;
        
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid credentials'
        );
    END IF;
    
    UPDATE public.admin_accounts 
    SET failed_login_attempts = 0,
        locked_until = NULL,
        last_login = NOW()
    WHERE id = admin_record.id;
    
    RETURN json_build_object(
        'success', true,
        'admin', json_build_object(
            'id', admin_record.id,
            'username', admin_record.username,
            'email', admin_record.email,
            'role', admin_record.role
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_all_experts()
RETURNS SETOF expert_accounts
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT *
  FROM public.expert_accounts
  ORDER BY created_at DESC NULLS LAST;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_expert_status(p_id uuid, p_status text)
RETURNS expert_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_row public.expert_accounts;
BEGIN
  IF p_status NOT IN ('approved', 'disapproved', 'pending') THEN
    RAISE EXCEPTION 'Invalid status: %', p_status USING ERRCODE = '22000';
  END IF;

  UPDATE public.expert_accounts
  SET status = p_status
  WHERE id = p_id
  RETURNING * INTO updated_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expert not found for id: %', p_id USING ERRCODE = 'P0002';
  END IF;

  RETURN updated_row;
END;
$$;

-- Expert Functions
CREATE OR REPLACE FUNCTION public.get_approved_experts()
RETURNS TABLE(
    auth_id uuid,
  name text,
  profile_picture text,
  specialization text,
  experience text,
  average_rating numeric,
  reviews_count integer,
  verified boolean,
  category text,
  languages text[],
    selected_services uuid[],
  status text,
  profile_completed boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.auth_id,
    ea.name,
    ea.profile_picture,
    ea.specialization,
    ea.experience,
    ea.average_rating,
    ea.reviews_count,
    ea.verified,
    ea.category,
    ea.languages,
    ea.selected_services,
    'approved'::text AS status,
    COALESCE(ea.profile_completed, false) AS profile_completed
  FROM public.expert_accounts ea
  WHERE ea.status = 'approved'
    AND COALESCE(ea.profile_completed, false) = true
  ORDER BY ea.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_approved_experts() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_approved_expert_presence(expert_auth_ids uuid[])
RETURNS TABLE(expert_id uuid, status text, accepting_calls boolean, last_activity timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT ep.expert_id, ep.status, ep.accepting_calls, ep.last_activity
  FROM public.expert_presence ep
  JOIN public.expert_accounts ea ON ea.auth_id = ep.expert_id
  WHERE ea.status = 'approved' AND ep.expert_id = ANY(expert_auth_ids)
$$;

-- Trigger Functions
CREATE OR REPLACE FUNCTION public.handle_expert_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'disapproved') THEN
    INSERT INTO public.expert_approval_notifications (expert_id, notification_type)
    VALUES (NEW.auth_id, CASE WHEN NEW.status = 'approved' THEN 'approval' ELSE 'rejection' END);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_on_call_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, content, read, reference_id)
  VALUES (
    NEW.expert_id,
    'incoming_call',
    'Incoming ' || CASE WHEN NEW.call_type = 'video' THEN 'Video' ELSE 'Audio' END || ' Call',
    'A user wants to connect with you',
    false,
    NEW.id::uuid
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_on_call_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'accepted' THEN
      INSERT INTO notifications (user_id, type, title, content, read, reference_id)
      VALUES (
        NEW.user_id,
        'call_accepted',
        'Call Accepted',
        'The expert has accepted your call. Connecting now...',
        false,
        NEW.id::uuid
      );
      
      UPDATE call_sessions
      SET 
        status = 'active',
        start_time = NOW(),
        answered_at = NOW()
      WHERE id = NEW.call_session_id;
      
    ELSIF NEW.status = 'declined' THEN
      INSERT INTO notifications (user_id, type, title, content, read, reference_id)
      VALUES (
        NEW.user_id,
        'call_declined',
        'Call Declined',
        'The expert declined your call request',
        false,
        NEW.id::uuid
      );
      
      UPDATE call_sessions
      SET 
        status = 'ended',
        end_time = NOW()
      WHERE id = NEW.call_session_id;
      
    ELSIF NEW.status = 'timeout' THEN
      INSERT INTO notifications (user_id, type, title, content, read, reference_id)
      VALUES (
        NEW.user_id,
        'call_timeout',
        'Call Timeout',
        'The call request timed out. The expert did not respond in time.',
        false,
        NEW.id::uuid
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_expert_user_reports_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS on_expert_approval ON public.expert_accounts;
CREATE TRIGGER on_expert_approval
    AFTER UPDATE OF status ON public.expert_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_expert_approval();

DROP TRIGGER IF EXISTS on_call_request_created ON public.incoming_call_requests;
CREATE TRIGGER on_call_request_created
    AFTER INSERT ON public.incoming_call_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_call_request();

DROP TRIGGER IF EXISTS on_call_request_status_change ON public.incoming_call_requests;
CREATE TRIGGER on_call_request_status_change
    AFTER UPDATE OF status ON public.incoming_call_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_call_status_change();

DROP TRIGGER IF EXISTS update_expert_user_reports_updated_at ON public.expert_user_reports;
CREATE TRIGGER update_expert_user_reports_updated_at
    BEFORE UPDATE ON public.expert_user_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_expert_user_reports_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on tables that need it
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incoming_call_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admin Sessions RLS (service role only)
DROP POLICY IF EXISTS service_role_only ON public.admin_sessions;
CREATE POLICY service_role_only ON public.admin_sessions
    FOR ALL
    USING (false)
    WITH CHECK (false);

-- Expert Accounts RLS
DROP POLICY IF EXISTS "Experts can read own account" ON public.expert_accounts;
CREATE POLICY "Experts can read own account" ON public.expert_accounts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Experts can update own account" ON public.expert_accounts;
CREATE POLICY "Experts can update own account" ON public.expert_accounts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_id)
    WITH CHECK (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Experts can insert own account" ON public.expert_accounts;
CREATE POLICY "Experts can insert own account" ON public.expert_accounts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = auth_id);

-- Expert Presence RLS
DROP POLICY IF EXISTS "Anyone can view expert presence" ON public.expert_presence;
CREATE POLICY "Anyone can view expert presence" ON public.expert_presence
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "expert upsert own presence (insert)" ON public.expert_presence;
CREATE POLICY "expert upsert own presence (insert)" ON public.expert_presence
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1
        FROM expert_accounts ea
        WHERE ea.auth_id = expert_presence.expert_id 
        AND ea.auth_id = auth.uid() 
        AND ea.status = 'approved'
    ));

DROP POLICY IF EXISTS "expert upsert own presence (update)" ON public.expert_presence;
CREATE POLICY "expert upsert own presence (update)" ON public.expert_presence
    FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1
        FROM expert_accounts ea
        WHERE ea.auth_id = expert_presence.expert_id 
        AND ea.auth_id = auth.uid() 
        AND ea.status = 'approved'
    ))
    WITH CHECK (EXISTS (
        SELECT 1
        FROM expert_accounts ea
        WHERE ea.auth_id = expert_presence.expert_id 
        AND ea.auth_id = auth.uid() 
        AND ea.status = 'approved'
    ));

-- Expert User Reports RLS
DROP POLICY IF EXISTS "Experts can create their own reports" ON public.expert_user_reports;
CREATE POLICY "Experts can create their own reports" ON public.expert_user_reports
    FOR INSERT
    TO public
    WITH CHECK (expert_id = auth.uid());

DROP POLICY IF EXISTS "Experts can view their own reports" ON public.expert_user_reports;
CREATE POLICY "Experts can view their own reports" ON public.expert_user_reports
    FOR SELECT
    TO public
    USING (expert_id = auth.uid());

DROP POLICY IF EXISTS "Experts can update their own reports" ON public.expert_user_reports;
CREATE POLICY "Experts can update their own reports" ON public.expert_user_reports
    FOR UPDATE
    TO public
    USING (expert_id = auth.uid());

-- Incoming Call Requests RLS
DROP POLICY IF EXISTS "Users can create call requests" ON public.incoming_call_requests;
CREATE POLICY "Users can create call requests" ON public.incoming_call_requests
    FOR INSERT
    TO authenticated
    WITH CHECK ((auth.uid() = user_id) AND (auth.uid() IS NOT NULL));

DROP POLICY IF EXISTS "Users can view their own call requests" ON public.incoming_call_requests;
CREATE POLICY "Users can view their own call requests" ON public.incoming_call_requests
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id) OR (auth.uid() = expert_id));

DROP POLICY IF EXISTS "experts can read their incoming requests" ON public.incoming_call_requests;
CREATE POLICY "experts can read their incoming requests" ON public.incoming_call_requests
    FOR SELECT
    TO public
    USING (auth.uid() = expert_id);

DROP POLICY IF EXISTS "Users can update their own call requests" ON public.incoming_call_requests;
CREATE POLICY "Users can update their own call requests" ON public.incoming_call_requests
    FOR UPDATE
    TO public
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Experts can update their incoming calls" ON public.incoming_call_requests;
CREATE POLICY "Experts can update their incoming calls" ON public.incoming_call_requests
    FOR UPDATE
    TO public
    USING (auth.uid() = expert_id)
    WITH CHECK (auth.uid() = expert_id);

-- Notifications RLS
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications" ON public.notifications
    FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT
    TO public
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE
    TO public
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (if not already created)
-- ============================================================================

-- These are mostly handled in table definitions, but ensuring key relationships
DO $$
BEGIN
    -- Add foreign key for referrals if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_referred_by_fkey'
    ) THEN
        ALTER TABLE public.users
        ADD CONSTRAINT users_referred_by_fkey
        FOREIGN KEY (referred_by) REFERENCES auth.users(id);
    END IF;
END $$;

