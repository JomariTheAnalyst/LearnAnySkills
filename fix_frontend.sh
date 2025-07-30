#!/bin/bash

echo "🔧 Fixing Frontend Dependencies..."

cd frontend

# Remove node_modules and package-lock.json
echo "Cleaning existing dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies with correct versions..."
npm install

echo "✅ Frontend dependencies fixed!"
echo ""
echo "You can now run:"
echo "cd frontend && npm run dev"
echo ""
echo "Or use the combined script:"
echo "./run_dev.sh"