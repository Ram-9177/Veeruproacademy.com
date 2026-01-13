#!/bin/bash

# 🚀 PRODUCTION DEPLOYMENT SCRIPT
# Veeru's Pro Academy - Complete Setup

echo "🚀 STARTING PRODUCTION DEPLOYMENT"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm is installed: $(npm --version)"

# Install dependencies
print_info "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check environment variables
if [ ! -f ".env.local" ]; then
    print_warning "No .env.local file found. Creating from .env.example..."
    cp .env.example .env.local
    print_warning "Please update .env.local with your production values!"
fi

# Setup database
print_info "Setting up database..."
node scripts/production-setup.js
if [ $? -eq 0 ]; then
    print_status "Database setup completed"
else
    print_error "Database setup failed"
    exit 1
fi

# Generate Prisma client
print_info "Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_status "Prisma client generated"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Build the application
print_info "Building application for production..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Test functionality
print_info "Testing application functionality..."
npm run dev &
DEV_PID=$!
sleep 10  # Wait for server to start

node scripts/test-functionality.js
TEST_RESULT=$?

# Kill the dev server
kill $DEV_PID

if [ $TEST_RESULT -eq 0 ]; then
    print_status "All functionality tests passed"
else
    print_error "Some functionality tests failed"
    exit 1
fi

echo ""
echo "=================================="
echo "🎉 PRODUCTION DEPLOYMENT COMPLETE!"
echo "=================================="
echo ""
print_status "✅ Dependencies installed"
print_status "✅ Database configured"
print_status "✅ Application built"
print_status "✅ Functionality tested"
echo ""
print_info "🔐 Default Admin Credentials:"
echo "   Email: admin@veerupro.com"
echo "   Password: VeeruPro2024!"
print_warning "   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!"
echo ""
print_info "🚀 To start the production server:"
echo "   npm start"
echo ""
print_info "📚 Features Ready:"
echo "   • User Authentication & Registration"
echo "   • Course Management & Enrollment"
echo "   • Individual Progress Tracking"
echo "   • Search Functionality"
echo "   • Admin Dashboard"
echo "   • Mobile Responsive Design"
echo "   • Certificate Generation"
echo ""
print_status "🎯 Your application is ready for production!"
echo ""