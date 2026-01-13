#!/bin/bash

# Neon + Vercel Quick Setup Script
# This script helps you quickly configure your environment for deployment

set -e

echo "🚀 Neon + Vercel Deployment Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        exit 0
    fi
fi

echo -e "${BLUE}Let's set up your environment variables${NC}"
echo ""

# Function to prompt for input with default
prompt_with_default() {
    local prompt=$1
    local default=$2
    local var_name=$3
    
    read -p "$prompt [$default]: " value
    value=${value:-$default}
    echo "$var_name=\"$value\"" >> .env.local
}

# Function to prompt for required input
prompt_required() {
    local prompt=$1
    local var_name=$2
    local value=""
    
    while [ -z "$value" ]; do
        read -p "$prompt (required): " value
        if [ -z "$value" ]; then
            echo -e "${RED}This field is required${NC}"
        fi
    done
    
    echo "$var_name=\"$value\"" >> .env.local
}

# Create .env.local
echo "# Environment Configuration" > .env.local
echo "# Generated: $(date)" >> .env.local
echo "" >> .env.local

echo -e "${GREEN}Step 1: Database Configuration${NC}"
echo "Get your Neon connection strings from: https://console.neon.tech"
echo ""

prompt_required "📊 DATABASE_URL (Neon pooled connection)" "DATABASE_URL"
prompt_required "🔗 DIRECT_URL (Neon direct connection)" "DIRECT_URL"

echo "" >> .env.local
echo -e "${GREEN}Step 2: Authentication${NC}"
echo ""

# Generate NEXTAUTH_SECRET if not provided
read -p "🔐 NEXTAUTH_SECRET (press Enter to auto-generate): " nextauth_secret
if [ -z "$nextauth_secret" ]; then
    # Check if openssl is available
    if command -v openssl &> /dev/null; then
        nextauth_secret=$(openssl rand -base64 32)
        echo -e "${BLUE}Generated NEXTAUTH_SECRET using openssl${NC}"
    else
        # Fallback to /dev/urandom if openssl is not available
        nextauth_secret=$(head -c 32 /dev/urandom | base64)
        echo -e "${BLUE}Generated NEXTAUTH_SECRET using /dev/urandom${NC}"
    fi
fi
echo "NEXTAUTH_SECRET=\"$nextauth_secret\"" >> .env.local

prompt_with_default "🌐 NEXTAUTH_URL" "http://localhost:3000" "NEXTAUTH_URL"
prompt_with_default "🌐 AUTH_URL" "http://localhost:3000" "AUTH_URL"

echo "" >> .env.local
echo -e "${GREEN}Step 3: Site Configuration${NC}"
echo ""

prompt_with_default "🌐 NEXT_PUBLIC_SITE_URL" "http://localhost:3000" "NEXT_PUBLIC_SITE_URL"
prompt_with_default "🌐 SITE_URL" "http://localhost:3000" "SITE_URL"

echo "" >> .env.local
echo -e "${GREEN}Step 4: Optional Services${NC}"
echo ""

read -p "Do you want to configure Google OAuth? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "" >> .env.local
    echo "# Google OAuth" >> .env.local
    prompt_required "📧 GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_ID"
    prompt_required "🔑 GOOGLE_CLIENT_SECRET" "GOOGLE_CLIENT_SECRET"
fi

read -p "Do you want to configure Supabase (for realtime)? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "" >> .env.local
    echo "# Supabase Realtime" >> .env.local
    prompt_required "🔄 NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_URL"
    prompt_required "🔑 NEXT_PUBLIC_SUPABASE_ANON_KEY" "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    prompt_required "🔐 SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_SERVICE_ROLE_KEY"
    echo "SUPABASE_URL=\"\$NEXT_PUBLIC_SUPABASE_URL\"" >> .env.local
    echo "SUPABASE_MONITORED_TABLES=\"lessons,courses,projects\"" >> .env.local
    echo "NEXT_PUBLIC_ENABLE_REALTIME=\"true\"" >> .env.local
fi

read -p "Do you want to configure YouTube API? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "" >> .env.local
    echo "# YouTube API" >> .env.local
    prompt_required "📺 YOUTUBE_API_KEY" "YOUTUBE_API_KEY"
fi

echo ""
echo -e "${GREEN}✅ .env.local has been created!${NC}"
echo ""

# Test database connection
echo -e "${BLUE}Testing database connection...${NC}"
if command -v node &> /dev/null; then
    node -e "
        const { PrismaClient } = require('@prisma/client');
        require('dotenv').config({ path: '.env.local' });
        const prisma = new PrismaClient();
        prisma.\$queryRaw\`SELECT 1\`
            .then(() => {
                console.log('✅ Database connection successful!');
                process.exit(0);
            })
            .catch((error) => {
                console.error('❌ Database connection failed:', error.message);
                process.exit(1);
            })
            .finally(() => prisma.\$disconnect());
    " 2>/dev/null || echo -e "${YELLOW}⚠️  Prisma client not installed yet. Run 'npm install' first.${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js not found. Skipping database connection test.${NC}"
fi

echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Review your .env.local file"
echo "2. Run: ${BLUE}npm install${NC}"
echo "3. Run: ${BLUE}npm run db:generate${NC}"
echo "4. Run: ${BLUE}npx prisma migrate deploy${NC} (to apply migrations)"
echo "5. Run: ${BLUE}npm run dev${NC} (to start development server)"
echo ""
echo -e "${BLUE}For Vercel deployment, see: NEON_VERCEL_DEPLOYMENT.md${NC}"
echo ""
echo "🎉 Setup complete!"
