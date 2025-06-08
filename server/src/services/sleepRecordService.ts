// server/src/services/sleepRecordService.ts
import { eq } from 'drizzle-orm'
import { sleep_records } from '../db/schema'
import type { NewSleepRecord, SleepRecord, UpdateSleepRecord } from '../db/schema'
import type { Database } from '../types/database'

type SleepRecordServiceDeps = {
  db: Database
}

export const createSleepRecordService = ({ db }: SleepRecordServiceDeps) => {
  const calcDuration = (startIso: string, endIso: string): number => {
    const start = new Date(startIso).getTime()
    const end = new Date(endIso).getTime()
    return Math.round((end - start) / 1000 / 60)
  }

  // 1) 모든 기록 조회 (관리자용)
  const getAll = async (): Promise<SleepRecord[]> => {
    return db.select().from(sleep_records)
  }

  // 2) 사용자별 기록 조회
  const getByUserId = async (userId: number): Promise<SleepRecord[]> => {
    return db.select().from(sleep_records).where(eq(sleep_records.userId, userId))
  }

  // 3) 단일 기록 조회
  const getById = async (id: number): Promise<SleepRecord | undefined> => {
    const result = await db.select().from(sleep_records).where(eq(sleep_records.id, id)).limit(1)
    return result[0]
  }

  // 4) 기록 생성
  const create = async (data: NewSleepRecord): Promise<SleepRecord> => {
    const now = new Date().toISOString()

    // 1) durationMinutes가 전달되지 않았다면 계산
    const duration =
      data.durationMinutes != null
        ? data.durationMinutes
        : calcDuration(data.startTime, data.endTime)

    const toInsert: NewSleepRecord = {
      ...data,
      durationMinutes: duration,
      createdAt: now,
      updatedAt: now
    }

    const [created] = await db.insert(sleep_records).values(toInsert).returning()

    return created
  }

  // 5) 기록 수정
  const update = async (
    id: number,
    updates: UpdateSleepRecord
  ): Promise<SleepRecord | undefined> => {
    const now = new Date().toISOString()

    // 수정 시에도 startTime/endTime 변경이 있으면 duration 재계산
    let duration: number | undefined = updates.durationMinutes
    if (
      updates.startTime &&
      updates.endTime &&
      updates.startTime !== undefined &&
      updates.endTime !== undefined
    ) {
      duration = calcDuration(updates.startTime, updates.endTime)
    }

    const toUpdate = {
      ...updates,
      ...(duration != null ? { durationMinutes: duration } : {}),
      updatedAt: now
    }
    const [updated] = await db
      .update(sleep_records)
      .set(toUpdate)
      .where(eq(sleep_records.id, id))
      .returning()
    return updated
  }

  // 6) 기록 삭제
  const remove = async (id: number): Promise<boolean> => {
    const result = await db
      .delete(sleep_records)
      .where(eq(sleep_records.id, id))
      .returning({ id: sleep_records.id })
    return result.length > 0
  }

  return {
    getAll,
    getByUserId,
    getById,
    create,
    update,
    remove
  }
}

export type SleepRecordService = ReturnType<typeof createSleepRecordService>
