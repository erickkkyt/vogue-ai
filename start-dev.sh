#!/bin/bash

# Add Node.js to PATH
export PATH="$HOME/local/node/bin:$PATH"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please check your installation."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please check your installation."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo "🚀 Starting development server..."

# Start the development server
npm run dev
