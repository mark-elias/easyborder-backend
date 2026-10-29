import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DRIZZLE_DB } from './drizzle.constants';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const connectionString = config.getOrThrow<string>('DATABASE_URL');
        // create postgres connection pool
        const client = postgres(connectionString);
        // create drizzle instance with schema for type-safe queries
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DrizzleModule {}
