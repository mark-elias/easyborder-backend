import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';
import { DRIZZLE_DB } from 'src/db/drizzle.constants';
import * as schema from 'src/db/schema';
import { crossings, waitTimes } from 'src/db/schema';
import {
  ReformattedCommercialLanes,
  ReformattedPassengerLanes,
  ReformattedPedestrianLanes,
} from 'src/cbp/cbp.types';

@Injectable()
export class WaitTimeService {
  constructor(
    @Inject(DRIZZLE_DB) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  // SELECT wait time + crossing info with LEFT JOIN
  async getForCrossing(crossingId: string) {
    const [result] = await this.db
      .select({
        id: waitTimes.id,
        crossingId: waitTimes.crossingId,
        commercial: waitTimes.commercial,
        passenger: waitTimes.passenger,
        pedestrian: waitTimes.pedestrian,
        createdAt: waitTimes.createdAt,
        updatedAt: waitTimes.updatedAt,
        crossing: {
          id: crossings.id,
          portName: crossings.portName,
          crossingName: crossings.crossingName,
        },
      })
      .from(waitTimes)
      .leftJoin(crossings, eq(waitTimes.crossingId, crossings.id))
      .where(eq(waitTimes.crossingId, crossingId))
      .limit(1);

    return result ?? null;
  }

  //===== used by CBP service

  // DELETE FROM "WaitTime"
  async deleteAll(): Promise<void> {
    await this.db.delete(waitTimes);
  }

  // INSERT INTO "WaitTime" ...
  async create(waitTimeData: {
    crossingId: string;
    commercial?: ReformattedCommercialLanes;
    passenger?: ReformattedPassengerLanes;
    pedestrian?: ReformattedPedestrianLanes;
  }) {
    const now = new Date();
    const [waitTime] = await this.db
      .insert(waitTimes)
      .values({
        id: createId(),
        ...waitTimeData,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return waitTime;
  }
}
