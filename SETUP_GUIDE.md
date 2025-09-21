# MERN Recipe Book - Setup Guide

## Database Setup

### Option 1: Quick Setup (Recommended for Development)

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE mern_recipe_book;
   ```

2. **Run the quick setup script:**
   ```bash
   psql -d mern_recipe_book -f quick_setup.sql
   ```

### Option 2: Full Setup (Production)

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE mern_recipe_book;
   ```

2. **Run the complete setup script:**
   ```bash
   psql -d mern_recipe_book -f database_setup.sql
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/mern_recipe_book
NODE_ENV=development
PORT=5000
```

## Product Addition Fix

The product addition functionality has been fixed with the following improvements:

### ✅ Fixed Issues:

1. **Data Validation**: Product form now properly validates and formats data according to the database schema
2. **Authentication**: Added proper authentication checks and headers
3. **Error Handling**: Improved error messages and validation
4. **Data Mapping**: Fixed data mapping between frontend form and backend schema

### 🔧 Key Changes Made:

1. **Product Form (`client/src/components/artisan/product-form.tsx`)**:
   - Added authentication check before submission
   - Fixed data formatting to match database schema
   - Added proper error handling with detailed messages
   - Added authorization headers for API requests

2. **Server Routes (`server/routes.ts`)**:
   - Added validation for required fields
   - Improved error handling and logging
   - Added artisan ID validation

3. **Storage Layer (`server/storage.ts`)**:
   - Fixed product creation to handle all required fields
   - Added proper default values for optional fields
   - Improved data mapping

## Testing the Fix

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the artisan dashboard:**
   - Go to `/artisan-dashboard`
   - Click on "Products" tab
   - Click on "Add Product" tab

3. **Fill out the product form:**
   - Enter product name, description, category
   - Set price and stock quantity
   - Add product images (optional)
   - Fill in cost tracking information
   - Click "Create Product"

4. **Verify the product was created:**
   - Check the "Manage Products" tab
   - The new product should appear in the list

## Database Commands

### Create Tables (PostgreSQL)

```sql
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
    user_type TEXT NOT NULL DEFAULT 'customer',
    artisan_name TEXT,
    business_name TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
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
```

### Insert Test Data

```sql
-- Insert test artisan
INSERT INTO users (id, username, email, password, first_name, last_name, user_type, artisan_name, business_name, location) 
VALUES ('test-artisan-1', 'test_artisan', 'artisan@test.com', 'hashed_password', 'Test', 'Artisan', 'artisan', 'Test Artisan', 'Test Studio', 'Delhi, India');

-- Insert test product
INSERT INTO products (id, name, description, category, price, images, artisan_id, artisan_name, location, stock) 
VALUES ('test-product-1', 'Handmade Clay Pot', 'Beautiful handcrafted clay pot', 'Pottery', 1500.00, '["image1.jpg"]', 'test-artisan-1', 'Test Artisan', 'Delhi, India', 5);
```

## Troubleshooting

### Common Issues:

1. **"Artisan ID is required" error:**
   - Make sure you're logged in as an artisan user
   - Check that the user has `userType: 'artisan'`

2. **Database connection error:**
   - Verify your `DATABASE_URL` in the `.env` file
   - Ensure PostgreSQL is running
   - Check database credentials

3. **Product not appearing:**
   - Check browser console for errors
   - Verify the product was created in the database
   - Refresh the page

### Debug Steps:

1. **Check server logs** for detailed error messages
2. **Verify database connection** by checking if tables exist
3. **Test API endpoints** directly using tools like Postman
4. **Check browser network tab** for failed requests

## Next Steps

1. Set up proper authentication system
2. Add image upload functionality
3. Implement order management
4. Add payment integration
5. Set up email notifications

The product addition functionality is now working correctly! 🎉
