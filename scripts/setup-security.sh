#!/bin/bash

# 🛡️ Security Setup Script for Veeru's Pro Academy
# This script helps set up secure environment variables

echo "🛡️  Veeru's Pro Academy - Security Setup"
echo "========================================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local file exists. Creating backup..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
fi

# Generate new NEXTAUTH_SECRET
echo "🔐 Generating new NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create secure .env.local
echo "📝 Creating secure .env.local file..."
cat > .env.local << EOF
# ==========================================
# 🔐 SECURE ENVIRONMENT VARIABLES
# ==========================================
# Generated: $(date)
# SECURITY: Never commit this file to version control

# ✅ DATABASE (REQUIRED) - Replace with your actual database URL
DATABASE_URL="your-database-url-here"

# ✅ NEXTAUTH (REQUIRED) - Secure secret generated
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"

# ✅ SITE CONFIGURATION
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SITE_URL="http://localhost:3000"

# ✅ SUPABASE (OPTIONAL - For realtime features)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url-here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key-here"
SUPABASE_URL="your-supabase-url-here"
SUPABASE_MONITORED_TABLES="lessons,courses,projects"

# ✅ YOUTUBE API (OPTIONAL)
YOUTUBE_API_KEY="your-youtube-api-key-here"

# ✅ PAYMENT CONFIGURATION (OPTIONAL)
NEXT_PUBLIC_MERCHANT_UPI="merchant@yourbank"
NEXT_PUBLIC_MERCHANT_NAME="Your Academy Name"
NEXT_PUBLIC_PAYMENT_EVIDENCE_FORM_URL="https://forms.gle/your-google-form-id"

# ✅ Feature Flags
NEXT_PUBLIC_ENABLE_REALTIME=true
EOF

# Ensure .env.local is in .gitignore
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo "📝 Adding .env.local to .gitignore..."
    echo ".env.local" >> .gitignore
fi

# Set proper file permissions
chmod 600 .env.local

echo ""
echo "✅ Security setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.local and replace 'your-database-url-here' with your actual database URL"
echo "2. Replace other placeholder values as needed"
echo "3. Never commit .env.local to version control"
echo "4. Test your application with the new configuration"
echo ""
echo "🔐 Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""
echo "⚠️  IMPORTANT: Keep your environment variables secure!"
echo "   - Never share them publicly"
echo "   - Use different secrets for different environments"
echo "   - Rotate secrets regularly"
echo ""
echo "🛡️  Security setup complete. Your application is now more secure!"