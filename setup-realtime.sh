#!/bin/bash

# Real-Time Backend Setup Script for Veeru's Pro Academy
# This script sets up a free real-time backend using Supabase

set -e

echo "🚀 Setting up Real-Time Backend with Supabase (FREE)"
echo "=================================================="
echo ""

# Step 1: Install Supabase packages
echo "📦 Installing Supabase packages..."
npm install @supabase/supabase-js @supabase/realtime-js

echo ""
echo "✅ Packages installed!"
echo ""

# Step 2: Create .env.local template if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# ============================================
# SUPABASE REAL-TIME DATABASE CONFIGURATION
# ============================================

# Get these from https://app.supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-only (NEVER commit this!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database type
NEXT_PUBLIC_DATABASE_TYPE=supabase

# ============================================
# LEGACY DATABASE (keep for now)
# ============================================
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
EOF
    echo "✅ .env.local created (update with your Supabase credentials)"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "=================================================="
echo "📚 NEXT STEPS:"
echo "=================================================="
echo ""
echo "1. Go to https://supabase.com and create a FREE project"
echo ""
echo "2. Get your credentials from Settings → API:"
echo "   - Project URL"
echo "   - Anon Key"
echo "   - Service Role Key"
echo ""
echo "3. Update .env.local with your Supabase credentials"
echo ""
echo "4. In Supabase SQL Editor, run the setup SQL from REALTIME_SETUP.md"
echo ""
echo "5. Enable Real-Time in Supabase Console → Replication settings"
echo ""
echo "6. Run tests:"
echo "   npm run dev"
echo "   # Visit http://localhost:3000/admin/dashboard"
echo ""
echo "=================================================="
echo "📖 Full Setup Guide: REALTIME_SETUP.md"
echo "=================================================="
echo ""
echo "✅ Setup complete!"
