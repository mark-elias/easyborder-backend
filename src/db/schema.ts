import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

// ======= enums
export const travelerTypeEnum = pgEnum('TravelerType', [
  'passenger',
  'pedestrian',
  'commercial',
]);

export const laneTypeEnum = pgEnum('LaneType', [
  'standard',
  'sentri',
  'ready',
  'fast',
]);

// ============= tables
export const users = pgTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const crossings = pgTable('Crossing', {
  id: text('id').primaryKey(),
  portNumber: text('portNumber').notNull().unique(),
  portName: text('portName').notNull(),
  crossingName: text('crossingName'),
  originCountry: text('originCountry').notNull(),
  originCity: text('originCity').notNull(),
  destinationCity: text('destinationCity').notNull(),
  portStatus: text('portStatus'),
  hours: text('hours'),
  constructionNotice: text('constructionNotice'),
  hasCommercialLanes: boolean('hasCommercialLanes').default(false).notNull(),
  hasPassengerLanes: boolean('hasPassengerLanes').default(false).notNull(),
  hasPedestrianLanes: boolean('hasPedestrianLanes').default(false).notNull(),
  maxCommercialLanes: integer('maxCommercialLanes').default(0).notNull(),
  maxPassengerLanes: integer('maxPassengerLanes').default(0).notNull(),
  maxPedestrianLanes: integer('maxPedestrianLanes').default(0).notNull(),
  cbpLastUpdateDate: text('cbpLastUpdateDate'),
  cbpLastUpdateTime: text('cbpLastUpdateTime'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const waitTimes = pgTable('WaitTime', {
  id: text('id').primaryKey(),
  crossingId: text('crossingId')
    .notNull()
    .unique()
    .references(() => crossings.id, { onDelete: 'cascade' }),
  commercial: json('commercial'),
  passenger: json('passenger'),
  pedestrian: json('pedestrian'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const favorites = pgTable(
  'Favorite',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    crossingId: text('crossingId')
      .notNull()
      .references(() => crossings.id, { onDelete: 'cascade' }),
    travelerType: travelerTypeEnum('travelerType').notNull(),
    laneType: laneTypeEnum('laneType').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => [
    unique().on(
      table.userId,
      table.crossingId,
      table.travelerType,
      table.laneType,
    ),
  ],
);

export const posts = pgTable('Post', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});
