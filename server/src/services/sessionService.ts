import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '../types/database'
import { sessions, users } from '../db/schema'
import type { NewSession, Session, User } from '../db/schema'

type SessionServiceDeps = { db: Database }

export const createSessionService = ({ db }: SessionServiceDeps) => {
  /** 1. 이메일로 유저 찾기 */
  const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return user
  }

  /** 2. 세션 생성 */
  const createSession = async (userId: number, ttlMs: number): Promise<Session> => {
    const token = uuidv4()
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + ttlMs).toISOString()
    const toInsert: NewSession = { userId, token, createdAt: now, expiresAt }
    const [session] = await db.insert(sessions).values(toInsert).returning()
    return session
  }

  /** 3. 토큰으로 세션 조회 */
  const getSessionByToken = async (token: string): Promise<Session | undefined> => {
    const [sess] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1)
    return sess
  }

  /** 4. 세션 삭제(로그아웃) */
  const deleteSession = async (token: string): Promise<boolean> => {
    const res = await db
      .delete(sessions)
      .where(eq(sessions.token, token))
      .returning({ id: sessions.id })
    return res.length > 0
  }

  return {
    getUserByEmail,
    createSession,
    getSessionByToken,
    deleteSession
  }
}

export type SessionService = ReturnType<typeof createSessionService>
