#!/bin/bash

# Swipe4Care Startup Script
echo "🏥 Starting Swipe4Care..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit .env file and add your Gemini API key"
        echo "   Get your API key at: https://makersuite.google.com/app/apikey"
        echo ""
        echo "❌ Cannot start without valid API key. Exiting..."
        exit 1
    else
        echo "❌ No .env.example file found. Please create .env manually."
        exit 1
    fi
fi

# Check if API key is still placeholder
if grep -q "your_gemini_api_key_here" .env; then
    echo "⚠️  Please replace the placeholder API key in .env file"
    echo "   Get your API key at: https://makersuite.google.com/app/apikey"
    echo "❌ Cannot start with placeholder API key. Exiting..."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

echo "🚀 Starting development servers..."
echo "   Backend will run on: http://localhost:3001"
echo "   Frontend will run on: http://localhost:3000"
echo ""
echo "👆 Once servers start, open http://localhost:3000 in your browser"
echo ""

npm run dev