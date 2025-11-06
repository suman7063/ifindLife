#!/bin/bash

# ngrok tunnel script for iFindLife development
# This exposes your local dev server (port 8080) to the internet

echo "🚇 Starting ngrok tunnel for port 8080..."
echo "📱 Your app will be accessible on other devices via the ngrok URL"
echo ""
echo "⚠️  If you see an authentication error, verify your email at:"
echo "   https://dashboard.ngrok.com/user/settings"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo ""

# Start ngrok on port 8080
ngrok http 8080

