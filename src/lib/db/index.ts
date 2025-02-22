// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });