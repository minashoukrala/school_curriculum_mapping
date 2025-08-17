#!/bin/bash

echo "Starting build process..."

# Install frontend dependencies and build
echo "Building frontend..."
cd ../frontend
npm ci --only=production
npm run build
cd ../render-deploy

# Install backend dependencies
echo "Installing backend dependencies..."
cd ../backend
npm ci --only=production
cd ../render-deploy

echo "Build completed successfully!"
