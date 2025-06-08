import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 사용자 테이블 스키마
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['ADMIN', 'USER', 'GUEST'] })
    .notNull()
    .default('USER'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 수면 기록 테이블 스키마
export const sleep_records = sqliteTable('sleep_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  quality: integer('quality').notNull().default(3), // 수면 품질 점수 (1-5)
  notes: text('notes'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 세션 테이블 스키마
export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token') // 세션 식별 토큰
    .notNull()
    .unique(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  expiresAt: text('expires_at').notNull()
})

// 사용자 타입 정의
export type SleepRecord = typeof sleep_records.$inferSelect
export type NewSleepRecord = typeof sleep_records.$inferInsert
export type UpdateSleepRecord = Partial<Omit<NewSleepRecord, 'id' | 'createdAt' | 'updatedAt'>>

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UpdateUser = Partial<Omit<NewUser, 'id' | 'createdAt'>>
