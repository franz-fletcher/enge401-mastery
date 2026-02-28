import { relations, sql } from 'drizzle-orm';
import {
  integer,
  real,
  sqliteTable,
  text,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

// Users table (for anonymous auth via NextAuth)
export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    anonymousId: text('anonymous_id').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
    lastActiveAt: integer('last_active_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
  },
  (table) => ({
    anonymousIdIdx: uniqueIndex('anonymous_id_idx').on(table.anonymousId),
  })
);

// Progress tracking table
export const progress = sqliteTable(
  'progress',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    chapterId: integer('chapter_id').notNull(),
    exerciseType: text('exercise_type').notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
    accuracy: real('accuracy').notNull(),
    attempts: integer('attempts').notNull().default(1),
    difficulty: text('difficulty', {
      enum: ['easy', 'medium', 'hard'],
    }),
    isCorrect: integer('is_correct', { mode: 'boolean' }),
  },
  (table) => ({
    userIdIdx: index('progress_user_id_idx').on(table.userId),
    chapterIdIdx: index('progress_chapter_id_idx').on(table.chapterId),
    userChapterIdx: index('progress_user_chapter_idx').on(
      table.userId,
      table.chapterId
    ),
  })
);

// Spaced repetition (SM-2 algorithm) table
export const spacedRepetition = sqliteTable(
  'spaced_repetition',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    chapterId: integer('chapter_id').notNull(),
    difficulty: text('difficulty', {
      enum: ['easy', 'medium', 'hard'],
    }).notNull(),
    nextReviewAt: integer('next_review_at', { mode: 'timestamp_ms' }).notNull(),
    interval: integer('interval').notNull().default(0), // days
    easeFactor: real('ease_factor').notNull().default(2.5),
    repetitions: integer('repetitions').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
  },
  (table) => ({
    userIdIdx: index('sr_user_id_idx').on(table.userId),
    chapterIdIdx: index('sr_chapter_id_idx').on(table.chapterId),
    nextReviewIdx: index('sr_next_review_idx').on(table.nextReviewAt),
    userChapterIdx: uniqueIndex('sr_user_chapter_idx').on(
      table.userId,
      table.chapterId
    ),
  })
);

// Study sessions table
export const studySessions = sqliteTable(
  'study_sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    startedAt: integer('started_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
    endedAt: integer('ended_at', { mode: 'timestamp_ms' }),
    exercisesCompleted: integer('exercises_completed').notNull().default(0),
    accuracy: real('accuracy'),
  },
  (table) => ({
    userIdIdx: index('session_user_id_idx').on(table.userId),
    startedAtIdx: index('session_started_at_idx').on(table.startedAt),
  })
);

// Calendar events table (for future study scheduling)
export const calendarEvents = sqliteTable(
  'calendar_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    type: text('type', {
      enum: ['study_goal', 'review_due', 'milestone'],
    }).notNull(),
    completed: integer('completed', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => Date.now()),
  },
  (table) => ({
    userIdIdx: index('calendar_user_id_idx').on(table.userId),
    dateIdx: index('calendar_date_idx').on(table.date),
    typeIdx: index('calendar_type_idx').on(table.type),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(progress),
  spacedRepetition: many(spacedRepetition),
  studySessions: many(studySessions),
  calendarEvents: many(calendarEvents),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
}));

export const spacedRepetitionRelations = relations(spacedRepetition, ({ one }) => ({
  user: one(users, {
    fields: [spacedRepetition.userId],
    references: [users.id],
  }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  user: one(users, {
    fields: [calendarEvents.userId],
    references: [users.id],
  }),
}));

// NextAuth.js required tables
export const accounts = sqliteTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Relations for NextAuth tables
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;

export type SpacedRepetition = typeof spacedRepetition.$inferSelect;
export type NewSpacedRepetition = typeof spacedRepetition.$inferInsert;

export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;
