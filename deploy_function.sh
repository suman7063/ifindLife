#!/bin/bash
echo "=== Deploying Agora Token Generation Function ==="
echo ""
echo "Step 1: Login to Supabase (opens browser)..."
supabase login

if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please run 'supabase login' manually first."
    exit 1
fi

echo ""
echo "Step 2: Linking to project..."
supabase link --project-ref nmcqyudqvbldxwzhyzma

if [ $? -ne 0 ]; then
    echo "⚠️  Link failed (may already be linked). Continuing..."
fi

echo ""
echo "Step 3: Deploying generate-agora-token function..."
supabase functions deploy generate-agora-token

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Function deployed successfully!"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "   1. Go to Supabase Dashboard → Edge Functions → Secrets"
    echo "   2. Add secret: AGORA_APP_ID = (value from your .env VITE_AGORA_APP_ID)"
    echo "   3. Add secret: AGORA_APP_CERTIFICATE = (optional, for token auth)"
    echo ""
    echo "   Dashboard: https://supabase.com/dashboard/project/nmcqyudqvbldxwzhyzma/settings/functions"
else
    echo ""
    echo "❌ Deployment failed. Check error messages above."
    exit 1
fi
