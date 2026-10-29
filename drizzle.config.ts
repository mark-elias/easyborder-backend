import { defineConfig } from 'drizzle-kit';

// cant use the nestjs ConfigModule since this is a CLI config file

// load the correct env file based on NODE_ENV (defaults to development)
// process.loadEnvFile is built into Node 22+, no dotenv package needed
const env = process.env.NODE_ENV || 'development';
process.loadEnvFile(`.env.${env}`);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle', // generated SQL migration files go here
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
