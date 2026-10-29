import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';
import { DRIZZLE_DB } from 'src/db/drizzle.constants';
import * as schema from 'src/db/schema';
import { crossings } from 'src/db/schema';

// Drizzle inferred types for insert/update
type CrossingInsert = typeof crossings.$inferInsert;
type CrossingUpdate = Partial<CrossingInsert>;

@Injectable()
export class CrossingService {
  constructor(
    @Inject(DRIZZLE_DB) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  // SELECT * FROM "Crossing" WHERE originCountry = ? AND originCity = ? ORDER BY portName ASC
  async getCrossingsByCountryAndCity(
    originCountry: string,
    originCity: string,
  ) {
    return this.db
      .select()
      .from(crossings)
      .where(
        and(
          eq(crossings.originCountry, originCountry),
          eq(crossings.originCity, originCity),
        ),
      )
      .orderBy(asc(crossings.portName));
  }

  //===== used by CBP service

  // SELECT * FROM "Crossing" WHERE portNumber = ? LIMIT 1
  async findByPortNumber(portNumber: string) {
    const [crossing] = await this.db
      .select()
      .from(crossings)
      .where(eq(crossings.portNumber, portNumber))
      .limit(1);

    return crossing ?? null;
  }

  // create new crossing
  async create(
    crossingData: Omit<CrossingInsert, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const now = new Date();
    const [crossing] = await this.db
      .insert(crossings)
      .values({
        id: createId(),
        ...crossingData,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return crossing;
  }

  // update existing crossing
  async update(id: string, updates: CrossingUpdate) {
    const [crossing] = await this.db
      .update(crossings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(crossings.id, id))
      .returning();

    return crossing;
  }
}
