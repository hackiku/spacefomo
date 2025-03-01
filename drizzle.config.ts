import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { join } from 'path';

// config({ path: '.env' });

config({ path: ['env.local', '.env'].find(Boolean) })

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/db/schema.ts',
	out: './supabase/migrations',
	dbCredentials: {
		// url: process.env.DATABASE_URL!,
		url: process.env.DATABASE_URL ||
			'postgresql://postgres:postgres@localhost:54322/postgres',
	},


});
