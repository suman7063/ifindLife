#!/bin/bash

echo "=== Deploying Expert Welcome Email Edge Function ==="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "Step 1: Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in. Attempting login..."
    supabase login
    
    if [ $? -ne 0 ]; then
        echo "❌ Login failed. Please run 'supabase login' manually first."
        exit 1
    fi
fi

echo ""
echo "Step 2: Linking to project..."
PROJECT_REF=$(grep "project_id" supabase/config.toml | cut -d'"' -f2)
if [ -z "$PROJECT_REF" ]; then
    echo "❌ Could not find project_id in supabase/config.toml"
    exit 1
fi

supabase link --project-ref "$PROJECT_REF"

if [ $? -ne 0 ]; then
    echo "⚠️  Link failed (may already be linked). Continuing..."
fi

echo ""
echo "Step 3: Deploying send-expert-welcome-email function..."
supabase functions deploy send-expert-welcome-email

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy send-expert-welcome-email"
    exit 1
fi

echo ""
echo "✅ Function deployed successfully!"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Go to Supabase Dashboard → Edge Functions → Secrets"
echo "   2. Add/Verify secret: RESEND_API_KEY = (your Resend API key)"
echo "   3. Add/Verify secret: APP_URL = (your app URL, e.g., https://ifindlife.com)"
echo ""
echo "   Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
echo ""
echo "📝 Note: Function does NOT require JWT authentication (verify_jwt = false)"
echo "   This allows it to be called from frontend after expert registration"

