create table "public"."admin_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "username" text not null,
    "email" text not null,
    "password_hash" text not null,
    "role" text not null default 'admin'::text,
    "is_active" boolean not null default true,
    "last_login" timestamp with time zone,
    "failed_login_attempts" integer not null default 0,
    "locked_until" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."admin_accounts" enable row level security;

create table "public"."admin_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "admin_id" uuid not null,
    "session_token" text not null,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now(),
    "ip_address" inet,
    "user_agent" text,
    "revoked_at" timestamp with time zone
);


alter table "public"."admin_sessions" enable row level security;

create table "public"."appointments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "expert_id" uuid not null,
    "expert_name" text not null,
    "appointment_date" date not null,
    "duration" integer not null,
    "status" text,
    "service_id" integer,
    "notes" text,
    "channel_name" text,
    "token" text,
    "uid" integer,
    "created_at" timestamp with time zone default now(),
    "start_time" time without time zone,
    "end_time" time without time zone,
    "google_calendar_event_id" text,
    "user_calendar_event_id" text,
    "time_slot_id" uuid,
    "reminder_sent" boolean default false,
    "payment_status" text default 'pending'::text,
    "razorpay_payment_id" text
);


create table "public"."call_sessions" (
    "id" text not null,
    "expert_id" uuid not null,
    "user_id" uuid not null,
    "channel_name" text not null,
    "call_type" text,
    "status" text default 'pending'::text,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "duration" integer,
    "cost" numeric,
    "currency" text default 'USD'::text,
    "selected_duration" integer,
    "pricing_tier" text default 'standard'::text,
    "payment_method" text,
    "rating" integer,
    "review" text,
    "recording_url" text,
    "analytics_data" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "expert_category" text,
    "cost_eur" numeric default 0,
    "appointment_id" uuid,
    "call_direction" character varying default 'outgoing'::character varying,
    "expert_auth_id" uuid,
    "missed_call" boolean default false,
    "answered_at" timestamp with time zone,
    "call_metadata" jsonb not null default '{}'::jsonb,
    "agora_channel_name" character varying,
    "agora_token" text,
    "payment_status" text default 'pending'::text,
    "razorpay_payment_id" text,
    "failure_reason" text
);


create table "public"."expert_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "auth_id" uuid,
    "name" text not null,
    "email" text not null,
    "phone" text,
    "address" text,
    "city" text,
    "state" text,
    "country" text,
    "specialization" text,
    "experience" text,
    "bio" text,
    "certificate_urls" text[] not null default '{}'::text[],
    "profile_picture" text,
    "selected_services" integer[] not null default '{}'::integer[],
    "average_rating" numeric default 0,
    "reviews_count" integer default 0,
    "verified" boolean default false,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "user_id" uuid,
    "category" text,
    "onboarding_completed" boolean default false,
    "pricing_set" boolean default false,
    "availability_set" boolean default false,
    "profile_completed" boolean default false,
    "languages" text[] not null default '{}'::text[]
);


alter table "public"."expert_accounts" enable row level security;

create table "public"."expert_approval_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "notification_type" text not null,
    "email_sent" boolean default false,
    "email_sent_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
);


create table "public"."expert_availabilities" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "day_of_week" integer not null,
    "start_time" time without time zone not null,
    "end_time" time without time zone not null,
    "is_available" boolean not null default true,
    "timezone" text not null default 'UTC'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."expert_away_messages" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "user_id" uuid not null,
    "message" text not null,
    "is_read" boolean default false,
    "sent_at" timestamp with time zone not null default now(),
    "read_at" timestamp with time zone
);


create table "public"."expert_categories" (
    "id" text not null,
    "name" text not null,
    "description" text,
    "base_price_usd" numeric default 0,
    "base_price_inr" numeric default 0,
    "base_price_eur" numeric default 0,
    "created_at" timestamp with time zone default now()
);


create table "public"."expert_presence" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "status" text not null,
    "accepting_calls" boolean not null default true,
    "last_activity" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."expert_presence" enable row level security;

create table "public"."expert_pricing_tiers" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "category" text not null,
    "session_30_inr" numeric default 0,
    "session_30_eur" numeric default 0,
    "session_60_inr" numeric default 0,
    "session_60_eur" numeric default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."expert_service_specializations" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "service_id" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "is_available" boolean default true,
    "is_primary_service" boolean default false,
    "proficiency_level" text default 'intermediate'::text
);


create table "public"."expert_services" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "service_id" integer not null,
    "admin_assigned_rate_inr" numeric,
    "admin_assigned_rate_usd" numeric,
    "assigned_at" timestamp with time zone,
    "assigned_by" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."expert_user_reports" (
    "id" uuid not null default gen_random_uuid(),
    "expert_id" uuid not null,
    "reported_user_id" uuid,
    "reported_user_email" text,
    "reason" text not null,
    "details" text,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."expert_user_reports" enable row level security;

create table "public"."incoming_call_requests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "expert_id" uuid not null,
    "call_type" character varying(10) not null,
    "status" character varying(20) not null default 'pending'::character varying,
    "channel_name" character varying(255) not null,
    "agora_token" text,
    "agora_uid" integer,
    "estimated_cost_eur" numeric(10,2),
    "estimated_cost_inr" numeric(10,2),
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "call_session_id" text,
    "user_metadata" jsonb default '{}'::jsonb
);


alter table "public"."incoming_call_requests" enable row level security;

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "sender_id" uuid not null,
    "receiver_id" uuid not null,
    "content" text not null,
    "read" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."newsletter_subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying not null,
    "created_at" timestamp with time zone default now(),
    "active" boolean default true
);


create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "type" text not null,
    "title" text not null,
    "content" text,
    "sender_id" uuid,
    "reference_id" uuid,
    "read" boolean default false,
    "created_at" timestamp with time zone default now()
);


create table "public"."profiles" (
    "id" uuid not null,
    "name" text,
    "email" text,
    "phone" text,
    "country" text,
    "city" text,
    "currency" text default 'USD'::text,
    "profile_picture" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "reward_points" integer default 0
);


create table "public"."programs" (
    "id" integer generated by default as identity not null,
    "title" text not null,
    "description" text not null,
    "duration" text not null,
    "sessions" integer not null,
    "price" numeric not null,
    "image" text not null,
    "category" text,
    "created_at" timestamp with time zone default now(),
    "enrollments" integer default 0,
    "programtype" text default 'wellness'::text
);


create table "public"."referral_settings" (
    "id" uuid not null default gen_random_uuid(),
    "program_enabled" boolean not null default false,
    "reward_amount" numeric not null default 0,
    "currency" text not null default 'INR'::text,
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."referrals" (
    "id" uuid not null default gen_random_uuid(),
    "referrer_id" uuid not null,
    "referred_id" uuid not null,
    "referral_code" text not null,
    "status" text default 'pending'::text,
    "reward_claimed" boolean default false,
    "created_at" timestamp with time zone default now(),
    "completed_at" timestamp with time zone
);


create table "public"."services" (
    "id" integer generated by default as identity not null,
    "name" text not null,
    "description" text,
    "rate_usd" numeric not null,
    "rate_inr" numeric not null,
    "rate_eur" numeric default 0,
    "category" text,
    "duration" integer default 60,
    "featured" boolean default false
);


create table "public"."support_requests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category" text not null,
    "subject" text not null,
    "message" text not null,
    "status" text not null default 'open'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "admin_notes" text,
    "resolved_at" timestamp with time zone
);


create table "public"."testimonials" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "location" text not null,
    "rating" integer not null,
    "text" text not null,
    "date" text not null,
    "image_url" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."user_expert_services" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "expert_id" uuid not null,
    "service_id" integer not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."user_favorite_programs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "program_id" integer not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."user_favorites" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "expert_id" uuid not null
);


create table "public"."user_reviews" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "rating" integer not null,
    "comment" text,
    "date" text not null,
    "verified" boolean default false,
    "expert_id" uuid,
    "expert_name" text,
    "user_name" text
);


create table "public"."users" (
    "id" uuid not null default auth.uid(),
    "name" text,
    "email" text,
    "phone" text,
    "country" text,
    "city" text,
    "currency" text default 'USD'::text,
    "profile_picture" text,
    "wallet_balance" numeric default 0,
    "created_at" timestamp with time zone default now(),
    "referral_code" text,
    "referred_by" uuid,
    "referral_link" text,
    "date_of_birth" date,
    "gender" text,
    "occupation" text,
    "preferences" jsonb not null default '{}'::jsonb,
    "terms_accepted" boolean default false,
    "privacy_accepted" boolean default false,
    "marketing_consent" boolean default false,
    "reward_points" integer default 0
);


create table "public"."waitlist" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "subscriber_number" integer not null,
    "honeypot" text,
    "created_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX admin_accounts_email_key ON public.admin_accounts USING btree (email);

CREATE UNIQUE INDEX admin_accounts_pkey ON public.admin_accounts USING btree (id);

CREATE UNIQUE INDEX admin_accounts_username_key ON public.admin_accounts USING btree (username);

CREATE UNIQUE INDEX admin_sessions_pkey ON public.admin_sessions USING btree (id);

CREATE UNIQUE INDEX admin_sessions_session_token_key ON public.admin_sessions USING btree (session_token);

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);

CREATE UNIQUE INDEX call_sessions_pkey ON public.call_sessions USING btree (id);

CREATE UNIQUE INDEX expert_accounts_auth_id_key ON public.expert_accounts USING btree (auth_id);

CREATE UNIQUE INDEX expert_accounts_email_key ON public.expert_accounts USING btree (email);

CREATE UNIQUE INDEX expert_accounts_pkey ON public.expert_accounts USING btree (id);

CREATE UNIQUE INDEX expert_approval_notifications_pkey ON public.expert_approval_notifications USING btree (id);

CREATE UNIQUE INDEX expert_availabilities_pkey ON public.expert_availabilities USING btree (id);

CREATE UNIQUE INDEX expert_away_messages_pkey ON public.expert_away_messages USING btree (id);

CREATE UNIQUE INDEX expert_categories_pkey ON public.expert_categories USING btree (id);

CREATE UNIQUE INDEX expert_presence_pkey ON public.expert_presence USING btree (id);

CREATE UNIQUE INDEX expert_pricing_tiers_expert_category_uniq ON public.expert_pricing_tiers USING btree (expert_id, category);

CREATE UNIQUE INDEX expert_pricing_tiers_pkey ON public.expert_pricing_tiers USING btree (id);

CREATE UNIQUE INDEX expert_service_specializations_pkey ON public.expert_service_specializations USING btree (id);

CREATE UNIQUE INDEX expert_services_pkey ON public.expert_services USING btree (id);

CREATE UNIQUE INDEX expert_user_reports_pkey ON public.expert_user_reports USING btree (id);

CREATE UNIQUE INDEX incoming_call_requests_pkey ON public.incoming_call_requests USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX newsletter_subscriptions_email_key ON public.newsletter_subscriptions USING btree (email);

CREATE UNIQUE INDEX newsletter_subscriptions_pkey ON public.newsletter_subscriptions USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX programs_pkey ON public.programs USING btree (id);

CREATE UNIQUE INDEX referral_settings_pkey ON public.referral_settings USING btree (id);

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (id);

CREATE UNIQUE INDEX referrals_referred_id_key ON public.referrals USING btree (referred_id);

CREATE UNIQUE INDEX services_pkey ON public.services USING btree (id);

CREATE UNIQUE INDEX support_requests_pkey ON public.support_requests USING btree (id);

CREATE UNIQUE INDEX testimonials_pkey ON public.testimonials USING btree (id);

CREATE UNIQUE INDEX user_expert_services_pkey ON public.user_expert_services USING btree (id);

CREATE UNIQUE INDEX user_favorite_programs_pkey ON public.user_favorite_programs USING btree (id);

CREATE UNIQUE INDEX user_favorites_pkey ON public.user_favorites USING btree (id);

CREATE UNIQUE INDEX user_reviews_pkey ON public.user_reviews USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_referral_code_key ON public.users USING btree (referral_code);

CREATE UNIQUE INDEX waitlist_email_key ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pkey ON public.waitlist USING btree (id);

alter table "public"."admin_accounts" add constraint "admin_accounts_pkey" PRIMARY KEY using index "admin_accounts_pkey";

alter table "public"."admin_sessions" add constraint "admin_sessions_pkey" PRIMARY KEY using index "admin_sessions_pkey";

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."call_sessions" add constraint "call_sessions_pkey" PRIMARY KEY using index "call_sessions_pkey";

alter table "public"."expert_accounts" add constraint "expert_accounts_pkey" PRIMARY KEY using index "expert_accounts_pkey";

alter table "public"."expert_approval_notifications" add constraint "expert_approval_notifications_pkey" PRIMARY KEY using index "expert_approval_notifications_pkey";

alter table "public"."expert_availabilities" add constraint "expert_availabilities_pkey" PRIMARY KEY using index "expert_availabilities_pkey";

alter table "public"."expert_away_messages" add constraint "expert_away_messages_pkey" PRIMARY KEY using index "expert_away_messages_pkey";

alter table "public"."expert_categories" add constraint "expert_categories_pkey" PRIMARY KEY using index "expert_categories_pkey";

alter table "public"."expert_presence" add constraint "expert_presence_pkey" PRIMARY KEY using index "expert_presence_pkey";

alter table "public"."expert_pricing_tiers" add constraint "expert_pricing_tiers_pkey" PRIMARY KEY using index "expert_pricing_tiers_pkey";

alter table "public"."expert_service_specializations" add constraint "expert_service_specializations_pkey" PRIMARY KEY using index "expert_service_specializations_pkey";

alter table "public"."expert_services" add constraint "expert_services_pkey" PRIMARY KEY using index "expert_services_pkey";

alter table "public"."expert_user_reports" add constraint "expert_user_reports_pkey" PRIMARY KEY using index "expert_user_reports_pkey";

alter table "public"."incoming_call_requests" add constraint "incoming_call_requests_pkey" PRIMARY KEY using index "incoming_call_requests_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."newsletter_subscriptions" add constraint "newsletter_subscriptions_pkey" PRIMARY KEY using index "newsletter_subscriptions_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."programs" add constraint "programs_pkey" PRIMARY KEY using index "programs_pkey";

alter table "public"."referral_settings" add constraint "referral_settings_pkey" PRIMARY KEY using index "referral_settings_pkey";

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."services" add constraint "services_pkey" PRIMARY KEY using index "services_pkey";

alter table "public"."support_requests" add constraint "support_requests_pkey" PRIMARY KEY using index "support_requests_pkey";

alter table "public"."testimonials" add constraint "testimonials_pkey" PRIMARY KEY using index "testimonials_pkey";

alter table "public"."user_expert_services" add constraint "user_expert_services_pkey" PRIMARY KEY using index "user_expert_services_pkey";

alter table "public"."user_favorite_programs" add constraint "user_favorite_programs_pkey" PRIMARY KEY using index "user_favorite_programs_pkey";

alter table "public"."user_favorites" add constraint "user_favorites_pkey" PRIMARY KEY using index "user_favorites_pkey";

alter table "public"."user_reviews" add constraint "user_reviews_pkey" PRIMARY KEY using index "user_reviews_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."waitlist" add constraint "waitlist_pkey" PRIMARY KEY using index "waitlist_pkey";

alter table "public"."admin_accounts" add constraint "admin_accounts_email_key" UNIQUE using index "admin_accounts_email_key";

alter table "public"."admin_accounts" add constraint "admin_accounts_username_key" UNIQUE using index "admin_accounts_username_key";

alter table "public"."admin_sessions" add constraint "admin_sessions_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES admin_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."admin_sessions" validate constraint "admin_sessions_admin_id_fkey";

alter table "public"."admin_sessions" add constraint "admin_sessions_session_token_key" UNIQUE using index "admin_sessions_session_token_key";

alter table "public"."appointments" add constraint "appointments_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_expert_id_fkey";

alter table "public"."appointments" add constraint "appointments_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(id) not valid;

alter table "public"."appointments" validate constraint "appointments_service_id_fkey";

alter table "public"."appointments" add constraint "appointments_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."appointments" validate constraint "appointments_status_check";

alter table "public"."appointments" add constraint "appointments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_user_id_fkey";

alter table "public"."call_sessions" add constraint "call_sessions_appointment_id_fkey" FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_appointment_id_fkey";

alter table "public"."call_sessions" add constraint "call_sessions_call_direction_check" CHECK (((call_direction)::text = ANY (ARRAY['incoming'::text, 'outgoing'::text]))) not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_call_direction_check";

alter table "public"."call_sessions" add constraint "call_sessions_call_type_check" CHECK ((call_type = ANY (ARRAY['audio'::text, 'video'::text]))) not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_call_type_check";

alter table "public"."call_sessions" add constraint "call_sessions_currency_check" CHECK ((currency = ANY (ARRAY['USD'::text, 'INR'::text]))) not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_currency_check";

alter table "public"."call_sessions" add constraint "call_sessions_expert_auth_id_fkey" FOREIGN KEY (expert_auth_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_expert_auth_id_fkey";

alter table "public"."call_sessions" add constraint "call_sessions_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE SET NULL not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_expert_id_fkey";

alter table "public"."call_sessions" add constraint "call_sessions_payment_method_check" CHECK ((payment_method = ANY (ARRAY['wallet'::text, 'gateway'::text]))) not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_payment_method_check";

alter table "public"."call_sessions" add constraint "call_sessions_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_rating_check";

alter table "public"."call_sessions" add constraint "call_sessions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'ended'::text, 'failed'::text]))) not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_status_check";

alter table "public"."call_sessions" add constraint "call_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."call_sessions" validate constraint "call_sessions_user_id_fkey";

alter table "public"."expert_accounts" add constraint "expert_accounts_auth_id_key" UNIQUE using index "expert_accounts_auth_id_key";

alter table "public"."expert_accounts" add constraint "expert_accounts_category_check" CHECK ((category = ANY (ARRAY['listening-volunteer'::text, 'listening-expert'::text, 'listening-coach'::text, 'mindfulness-expert'::text]))) not valid;

alter table "public"."expert_accounts" validate constraint "expert_accounts_category_check";

alter table "public"."expert_accounts" add constraint "expert_accounts_email_key" UNIQUE using index "expert_accounts_email_key";

alter table "public"."expert_accounts" add constraint "expert_accounts_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'disapproved'::text]))) not valid;

alter table "public"."expert_accounts" validate constraint "expert_accounts_status_check";

alter table "public"."expert_approval_notifications" add constraint "expert_approval_notifications_notification_type_check" CHECK ((notification_type = ANY (ARRAY['approval'::text, 'rejection'::text]))) not valid;

alter table "public"."expert_approval_notifications" validate constraint "expert_approval_notifications_notification_type_check";

alter table "public"."expert_availabilities" add constraint "expert_availabilities_day_of_week_check" CHECK (((day_of_week >= 0) AND (day_of_week <= 6))) not valid;

alter table "public"."expert_availabilities" validate constraint "expert_availabilities_day_of_week_check";

alter table "public"."expert_availabilities" add constraint "expert_availabilities_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."expert_availabilities" validate constraint "expert_availabilities_expert_id_fkey";

alter table "public"."expert_away_messages" add constraint "expert_away_messages_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(auth_id) not valid;

alter table "public"."expert_away_messages" validate constraint "expert_away_messages_expert_id_fkey";

alter table "public"."expert_presence" add constraint "expert_presence_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."expert_presence" validate constraint "expert_presence_expert_id_fkey";

alter table "public"."expert_presence" add constraint "expert_presence_status_check" CHECK ((status = ANY (ARRAY['available'::text, 'busy'::text, 'away'::text, 'offline'::text]))) not valid;

alter table "public"."expert_presence" validate constraint "expert_presence_status_check";

alter table "public"."expert_pricing_tiers" add constraint "expert_pricing_tiers_expert_category_uniq" UNIQUE using index "expert_pricing_tiers_expert_category_uniq";

alter table "public"."expert_pricing_tiers" add constraint "expert_pricing_tiers_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."expert_pricing_tiers" validate constraint "expert_pricing_tiers_expert_id_fkey";

alter table "public"."expert_service_specializations" add constraint "expert_service_specializations_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."expert_service_specializations" validate constraint "expert_service_specializations_expert_id_fkey";

alter table "public"."expert_service_specializations" add constraint "expert_service_specializations_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE not valid;

alter table "public"."expert_service_specializations" validate constraint "expert_service_specializations_service_id_fkey";

alter table "public"."expert_services" add constraint "expert_services_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."expert_services" validate constraint "expert_services_expert_id_fkey";

alter table "public"."expert_services" add constraint "expert_services_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE not valid;

alter table "public"."expert_services" validate constraint "expert_services_service_id_fkey";

alter table "public"."incoming_call_requests" add constraint "incoming_call_requests_call_session_id_fkey" FOREIGN KEY (call_session_id) REFERENCES call_sessions(id) not valid;

alter table "public"."incoming_call_requests" validate constraint "incoming_call_requests_call_session_id_fkey";

alter table "public"."incoming_call_requests" add constraint "incoming_call_requests_call_type_check" CHECK (((call_type)::text = ANY ((ARRAY['audio'::character varying, 'video'::character varying])::text[]))) not valid;

alter table "public"."incoming_call_requests" validate constraint "incoming_call_requests_call_type_check";

alter table "public"."incoming_call_requests" add constraint "incoming_call_requests_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(auth_id) not valid;

alter table "public"."incoming_call_requests" validate constraint "incoming_call_requests_expert_id_fkey";

alter table "public"."incoming_call_requests" add constraint "incoming_call_requests_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'declined'::character varying, 'timeout'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."incoming_call_requests" validate constraint "incoming_call_requests_status_check";

alter table "public"."messages" add constraint "messages_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_receiver_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."newsletter_subscriptions" add constraint "newsletter_subscriptions_email_key" UNIQUE using index "newsletter_subscriptions_email_key";

alter table "public"."notifications" add constraint "notifications_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) not valid;

alter table "public"."notifications" validate constraint "notifications_sender_id_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."programs" add constraint "programs_category_check" CHECK ((category = ANY (ARRAY['quick-ease'::text, 'resilience-building'::text, 'super-human'::text, 'issue-based'::text]))) not valid;

alter table "public"."programs" validate constraint "programs_category_check";

alter table "public"."referrals" add constraint "referrals_referred_id_fkey" FOREIGN KEY (referred_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."referrals" validate constraint "referrals_referred_id_fkey";

alter table "public"."referrals" add constraint "referrals_referred_id_key" UNIQUE using index "referrals_referred_id_key";

alter table "public"."referrals" add constraint "referrals_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."referrals" validate constraint "referrals_referrer_id_fkey";

alter table "public"."support_requests" add constraint "support_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."support_requests" validate constraint "support_requests_user_id_fkey";

alter table "public"."testimonials" add constraint "testimonials_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."testimonials" validate constraint "testimonials_rating_check";

alter table "public"."user_expert_services" add constraint "user_expert_services_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."user_expert_services" validate constraint "user_expert_services_expert_id_fkey";

alter table "public"."user_expert_services" add constraint "user_expert_services_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE not valid;

alter table "public"."user_expert_services" validate constraint "user_expert_services_service_id_fkey";

alter table "public"."user_expert_services" add constraint "user_expert_services_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_expert_services" validate constraint "user_expert_services_user_id_fkey";

alter table "public"."user_favorite_programs" add constraint "user_favorite_programs_program_id_fkey" FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE not valid;

alter table "public"."user_favorite_programs" validate constraint "user_favorite_programs_program_id_fkey";

alter table "public"."user_favorite_programs" add constraint "user_favorite_programs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_favorite_programs" validate constraint "user_favorite_programs_user_id_fkey";

alter table "public"."user_favorites" add constraint "user_favorites_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."user_favorites" validate constraint "user_favorites_expert_id_fkey";

alter table "public"."user_favorites" add constraint "user_favorites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_favorites" validate constraint "user_favorites_user_id_fkey";

alter table "public"."user_reviews" add constraint "user_reviews_expert_id_fkey" FOREIGN KEY (expert_id) REFERENCES expert_accounts(id) ON DELETE SET NULL not valid;

alter table "public"."user_reviews" validate constraint "user_reviews_expert_id_fkey";

alter table "public"."user_reviews" add constraint "user_reviews_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."user_reviews" validate constraint "user_reviews_user_id_fkey";

alter table "public"."users" add constraint "users_currency_check" CHECK ((currency = ANY (ARRAY['USD'::text, 'INR'::text, 'EUR'::text]))) not valid;

alter table "public"."users" validate constraint "users_currency_check";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_referral_code_key" UNIQUE using index "users_referral_code_key";

alter table "public"."users" add constraint "users_referred_by_fkey" FOREIGN KEY (referred_by) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_referred_by_fkey";

alter table "public"."waitlist" add constraint "waitlist_email_key" UNIQUE using index "waitlist_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.admin_list_all_experts()
 RETURNS SETOF expert_accounts
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT *
  FROM public.expert_accounts
  ORDER BY created_at DESC NULLS LAST;
$function$
;

CREATE OR REPLACE FUNCTION public.admin_update_expert_status(p_id uuid, p_status text)
 RETURNS expert_accounts
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  updated_row public.expert_accounts;
BEGIN
  -- Validate allowed statuses
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
$function$
;

CREATE OR REPLACE FUNCTION public.authenticate_admin(p_username text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
    admin_record RECORD;
    result JSON;
BEGIN
    -- Check if admin exists and is active
    SELECT id, username, email, role, password_hash, is_active, failed_login_attempts, locked_until
    INTO admin_record
    FROM public.admin_accounts
    WHERE username = p_username AND is_active = true;
    
    -- Check if admin exists
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid credentials'
        );
    END IF;
    
    -- Check if account is locked
    IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > NOW() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Account is temporarily locked'
        );
    END IF;
    
    -- Verify password using crypt function with the stored hash as salt
    IF NOT (admin_record.password_hash = crypt(p_password, admin_record.password_hash)) THEN
        -- Increment failed login attempts
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
    
    -- Reset failed login attempts and update last login
    UPDATE public.admin_accounts 
    SET failed_login_attempts = 0,
        locked_until = NULL,
        last_login = NOW()
    WHERE id = admin_record.id;
    
    -- Return success with admin data
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_approved_expert_presence(expert_auth_ids uuid[])
 RETURNS TABLE(expert_id uuid, status text, accepting_calls boolean, last_activity timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT ep.expert_id, ep.status, ep.accepting_calls, ep.last_activity
  FROM public.expert_presence ep
  JOIN public.expert_accounts ea ON ea.id = ep.expert_id
  WHERE ea.status = 'approved' AND ep.expert_id = ANY(expert_auth_ids)
$function$
;

CREATE OR REPLACE FUNCTION public.get_approved_experts()
 RETURNS SETOF expert_accounts
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT *
  FROM public.expert_accounts
  WHERE status = 'approved'
  ORDER BY created_at DESC NULLS LAST
$function$
;

CREATE OR REPLACE FUNCTION public.handle_expert_approval()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only proceed if status changed to 'approved' or 'disapproved'
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'disapproved') THEN
    -- Insert notification record only
    INSERT INTO public.expert_approval_notifications (expert_id, notification_type)
    VALUES (NEW.auth_id, CASE WHEN NEW.status = 'approved' THEN 'approval' ELSE 'rejection' END);
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_on_call_request()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Send notification to expert when a new call request is created
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
$function$
;

CREATE OR REPLACE FUNCTION public.notify_on_call_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only notify on status changes
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'accepted' THEN
      -- Notify user that call was accepted
      INSERT INTO notifications (user_id, type, title, content, read, reference_id)
      VALUES (
        NEW.user_id,
        'call_accepted',
        'Call Accepted',
        'The expert has accepted your call. Connecting now...',
        false,
        NEW.id::uuid
      );
      
      -- Update call session to active
      UPDATE call_sessions
      SET 
        status = 'active',
        start_time = NOW(),
        answered_at = NOW()
      WHERE id = NEW.call_session_id;
      
    ELSIF NEW.status = 'declined' THEN
      -- Notify user that call was declined
      INSERT INTO notifications (user_id, type, title, content, read, reference_id)
      VALUES (
        NEW.user_id,
        'call_declined',
        'Call Declined',
        'The expert declined your call request',
        false,
        NEW.id::uuid
      );
      
      -- Update call session to ended
      UPDATE call_sessions
      SET 
        status = 'ended',
        end_time = NOW()
      WHERE id = NEW.call_session_id;
      
    ELSIF NEW.status = 'timeout' THEN
      -- Notify user that call timed out
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_expert_user_reports_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$function$
;

create policy "Experts can insert own account"
on "public"."expert_accounts"
as permissive
for insert
to authenticated
with check ((auth.uid() = auth_id));


create policy "Experts can read own account"
on "public"."expert_accounts"
as permissive
for select
to authenticated
using ((auth.uid() = auth_id));


create policy "Experts can update own account"
on "public"."expert_accounts"
as permissive
for update
to authenticated
using ((auth.uid() = auth_id))
with check ((auth.uid() = auth_id));


create policy "Anyone can view expert presence"
on "public"."expert_presence"
as permissive
for select
to public
using (true);


create policy "expert upsert own presence (insert)"
on "public"."expert_presence"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM expert_accounts ea
  WHERE ((ea.id = expert_presence.expert_id) AND (ea.auth_id = auth.uid()) AND (ea.status = 'approved'::text)))));


create policy "expert upsert own presence (update)"
on "public"."expert_presence"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM expert_accounts ea
  WHERE ((ea.id = expert_presence.expert_id) AND (ea.auth_id = auth.uid()) AND (ea.status = 'approved'::text)))))
with check ((EXISTS ( SELECT 1
   FROM expert_accounts ea
  WHERE ((ea.id = expert_presence.expert_id) AND (ea.auth_id = auth.uid()) AND (ea.status = 'approved'::text)))));


create policy "Experts can create their own reports"
on "public"."expert_user_reports"
as permissive
for insert
to public
with check ((expert_id = auth.uid()));


create policy "Experts can update their own reports"
on "public"."expert_user_reports"
as permissive
for update
to public
using ((expert_id = auth.uid()));


create policy "Experts can view their own reports"
on "public"."expert_user_reports"
as permissive
for select
to public
using ((expert_id = auth.uid()));


create policy "Users can create call requests"
on "public"."incoming_call_requests"
as permissive
for insert
to authenticated
with check (((auth.uid() = user_id) AND (auth.uid() IS NOT NULL)));


create policy "Users can view their own call requests"
on "public"."incoming_call_requests"
as permissive
for select
to authenticated
using (((auth.uid() = user_id) OR (auth.uid() = expert_id)));


create policy "experts can read their incoming requests"
on "public"."incoming_call_requests"
as permissive
for select
to public
using ((auth.uid() = expert_id));


CREATE TRIGGER update_expert_user_reports_updated_at BEFORE UPDATE ON public.expert_user_reports FOR EACH ROW EXECUTE FUNCTION update_expert_user_reports_updated_at();

CREATE TRIGGER on_call_request_created AFTER INSERT ON public.incoming_call_requests FOR EACH ROW EXECUTE FUNCTION notify_on_call_request();

CREATE TRIGGER on_call_request_status_change AFTER UPDATE ON public.incoming_call_requests FOR EACH ROW WHEN (((old.status)::text IS DISTINCT FROM (new.status)::text)) EXECUTE FUNCTION notify_on_call_status_change();



  create policy "Authenticated delete avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'avatars'::text));



  create policy "Authenticated delete certificates"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'certificates'::text));



  create policy "Authenticated delete expert-certificates"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'expert-certificates'::text));



  create policy "Authenticated insert avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'avatars'::text));



  create policy "Authenticated insert certificates"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'certificates'::text));



  create policy "Authenticated insert expert-certificates"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'expert-certificates'::text));



  create policy "Authenticated update avatars"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'avatars'::text))
with check ((bucket_id = 'avatars'::text));



  create policy "Authenticated update certificates"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'certificates'::text))
with check ((bucket_id = 'certificates'::text));



  create policy "Authenticated update expert-certificates"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'expert-certificates'::text))
with check ((bucket_id = 'expert-certificates'::text));



  create policy "Public read avatars"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "Public read certificates"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'certificates'::text));



  create policy "Public read expert-certificates"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'expert-certificates'::text));



