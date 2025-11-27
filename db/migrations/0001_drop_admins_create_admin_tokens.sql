-- Migration: Drop admins table and create adminTokens table
-- Created: 2025-11-27
-- Drop the old admins table
DROP TABLE IF EXISTS "admins" CASCADE;
-- Create the new admin_tokens table
CREATE TABLE IF NOT EXISTS "admin_tokens" (
    "id" VARCHAR(256) PRIMARY KEY,
    "token_hash" VARCHAR(256) NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true NOT NULL,
    "created_at" TIMESTAMP DEFAULT now(),
    "last_used_at" TIMESTAMP
);
-- Create index on token_hash for faster lookups
CREATE INDEX IF NOT EXISTS "idx_admin_tokens_token_hash" ON "admin_tokens" ("token_hash");
-- Create index on is_active for faster active token queries
CREATE INDEX IF NOT EXISTS "idx_admin_tokens_is_active" ON "admin_tokens" ("is_active");