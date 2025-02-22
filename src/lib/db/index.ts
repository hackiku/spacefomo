// src/lib/db/index.ts
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'
import { DATABASE_URL } from '$env/static/private';

// config({ path: '.env' }); // or .env.local

// const client = postgres(connectionString);
// export const db = drizzle({ client });

// const client = postgres(process.env.DATABASE_URL!);
const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
