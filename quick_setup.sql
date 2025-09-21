-- Quick Database Setup for MERN Recipe Book
-- Run this in your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    user_type TEXT NOT NULL DEFAULT 'customer',
    artisan_name TEXT,
    business_name TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    images JSONB NOT NULL DEFAULT '[]',
    artisan_id VARCHAR REFERENCES users(id) NOT NULL,
    artisan_name TEXT NOT NULL,
    location TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_products_artisan_id ON products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a test artisan user (password: 'password123')
INSERT INTO users (id, username, email, password, first_name, last_name, user_type, artisan_name, business_name, location) 
VALUES ('test-artisan-1', 'test_artisan', 'artisan@test.com', '$2b$10$example_hash', 'Test', 'Artisan', 'artisan', 'Test Artisan', 'Test Studio', 'Delhi, India')
ON CONFLICT (email) DO NOTHING;
