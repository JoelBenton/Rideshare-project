#!/bin/sh

# Ensure tmp directory exists
mkdir -p /app/tmp

# Run migrations (safe even if already run)
node ace migration:run --force

# Start dev server
npm run dev
