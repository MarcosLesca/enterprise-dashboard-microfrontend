-- PostgreSQL initialization script for Enterprise Dashboard
-- This script runs when the PostgreSQL container starts

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created after Django migrations run

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Enterprise Dashboard PostgreSQL initialized successfully';
END $$;