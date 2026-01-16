import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import dotenv from "dotenv";
dotenv.config();

console.log("🚀 ~ process.env.DATABASE_URL:", process.env.DATABASE_URL);
console.log(
  "🚀 ~ process.env.HUBSPOT_ACCESS_TOKEN:",
  process.env.HUBSPOT_ACCESS_TOKEN
);
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create verification_codes table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
      )
    `);

    // Create donor_sessions table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS donor_sessions (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT NOT NULL,
        stripe_customer_id TEXT,
        expires_at TIMESTAMP NOT NULL
      )
    `);

    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  } finally {
    client.release();
  }
}
