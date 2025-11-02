#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Copy environment variables
echo "Setting up environment variables..."
echo "PORT=$PORT" > .env
echo "MONGO_URI=$MONGO_URI" >> .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
echo "FRONTEND_URL=$FRONTEND_URL" >> .env

# Start the application
echo "Starting the application..."
npm start