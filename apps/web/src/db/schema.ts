import { relations, sql } from 'drizzle-orm';
import {
  integer,
  real,
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core';

// Users table (for anonymous auth via NextAuth)
export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    anonymousId: text('anonymous_id').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    lastActiveAt: timestamp('last_active_at').notNull().defaultNow(),
  },
  (table) => ({
    anonymousIdIdx: uniqueIndex('anonymous_id_idx').on(table.anonymousId),
  })
);

// Progress tracking table
export const progress = pgTable(
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
    completedAt: timestamp('completed_at').notNull().defaultNow(),
    accuracy: real('accuracy').notNull(),
    attempts: integer('attempts').notNull().default(1),
    difficulty: text('difficulty', {
      enum: ['easy', 'medium', 'hard'],
    }),
    isCorrect: boolean('is_correct'),
    question: text('question'),
    answer: text('answer'),
    hints: text('hints'),
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
export const spacedRepetition = pgTable(
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
    nextReviewAt: timestamp('next_review_at').notNull(),
    interval: integer('interval').notNull().default(0), // days
    easeFactor: real('ease_factor').notNull().default(2.5),
    repetitions: integer('repetitions').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
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
export const studySessions = pgTable(
  'study_sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    endedAt: timestamp('ended_at'),
    exercisesCompleted: integer('exercises_completed').notNull().default(0),
    accuracy: real('accuracy'),
  },
  (table) => ({
    userIdIdx: index('session_user_id_idx').on(table.userId),
    startedAtIdx: index('session_started_at_idx').on(table.startedAt),
  })
);

// Calendar events table (for future study scheduling)
export const calendarEvents = pgTable(
  'calendar_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    date: timestamp('date').notNull(),
    type: text('type', {
      enum: ['study_goal', 'review_due', 'milestone'],
    }).notNull(),
    completed: boolean('completed').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
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
export const accounts = pgTable(
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

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires').notNull(),
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
