-- MERN Recipe Book Database Setup
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    address JSONB,
    user_type TEXT NOT NULL DEFAULT 'customer',
    artisan_name TEXT,
    business_name TEXT,
    location TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP,
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    images JSONB NOT NULL,
    model_3d TEXT,
    artisan_id VARCHAR REFERENCES users(id) NOT NULL,
    artisan_name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    stock INTEGER DEFAULT 0,
    weight DECIMAL(8, 2),
    dimensions JSONB,
    materials TEXT[],
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    -- Cost tracking fields
    material_cost DECIMAL(10, 2) DEFAULT 0,
    labor_cost DECIMAL(10, 2) DEFAULT 0,
    overhead_cost DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(10, 2) DEFAULT 0,
    profit_margin DECIMAL(5, 2) DEFAULT 0,
    -- Additional fields
    processing_time TEXT,
    care_instructions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR REFERENCES users(id) NOT NULL,
    artisan_id VARCHAR REFERENCES users(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    payment_id TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR REFERENCES orders(id) NOT NULL,
    product_id VARCHAR REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    product_id VARCHAR REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    product_id VARCHAR REFERENCES products(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR REFERENCES products(id) NOT NULL,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id),
    artisan_id VARCHAR REFERENCES users(id),
    messages JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Market analysis table
CREATE TABLE market_analysis (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR REFERENCES products(id),
    artisan_id VARCHAR REFERENCES users(id),
    analysis_type TEXT NOT NULL,
    data JSONB NOT NULL,
    insights TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_type ON users(user_type);

CREATE INDEX idx_products_artisan_id ON products(artisan_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_artisan_id ON orders(artisan_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_type ON analytics(type);
CREATE INDEX idx_analytics_date ON analytics(date);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_artisan_id ON chat_sessions(artisan_id);

CREATE INDEX idx_market_analysis_product_id ON market_analysis(product_id);
CREATE INDEX idx_market_analysis_artisan_id ON market_analysis(artisan_id);
CREATE INDEX idx_market_analysis_type ON market_analysis(analysis_type);

-- Insert sample data (optional)
-- You can uncomment these lines to add sample data for testing

-- Sample artisan user
-- INSERT INTO users (id, username, email, password, first_name, last_name, user_type, artisan_name, business_name, location) 
-- VALUES ('artisan-1', 'pottery_master', 'artisan@example.com', 'hashed_password', 'John', 'Doe', 'artisan', 'John Doe Pottery', 'John Doe Pottery Studio', 'Delhi, India');

-- Sample customer user
-- INSERT INTO users (id, username, email, password, first_name, last_name, user_type, location) 
-- VALUES ('customer-1', 'craft_lover', 'customer@example.com', 'hashed_password', 'Jane', 'Smith', 'customer', 'Mumbai, India');

-- Sample product
-- INSERT INTO products (id, name, description, category, price, images, artisan_id, artisan_name, location, stock) 
-- VALUES ('product-1', 'Handmade Clay Pot', 'Beautiful handcrafted clay pot perfect for home decoration', 'Pottery', 1500.00, '["image1.jpg", "image2.jpg"]', 'artisan-1', 'John Doe Pottery', 'Delhi, India', 5);
