import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wlqqpvmlgecdhrmadipv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection for direct queries
export const dbConfig = {
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.wlqqpvmlgecdhrmadipv',
  password: 'Openskills@123',
  ssl: { rejectUnauthorized: false },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};
