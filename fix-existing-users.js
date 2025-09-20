// Quick script to fix existing users who might have isEmailVerified: false
// Run this once to update existing users in your database

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { users } from './shared/schema.js';

// Database connection
const connectionString = `postgresql://postgres.wlqqpvmlgecdhrmadipv:Openskills@123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
const client = postgres(connectionString);
const db = drizzle(client);

async function fixExistingUsers() {
  try {
    console.log('Updating existing users to verified status...');
    
    // Update all users to have isEmailVerified: true
    const result = await db.update(users)
      .set({ 
        isEmailVerified: true,
        updatedAt: new Date()
      })
      .where(eq(users.isEmailVerified, false))
      .returning();

    console.log(`Updated ${result.length} users to verified status`);
    console.log('All users can now login without email verification!');
    
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await client.end();
  }
}

fixExistingUsers();
