import { sql, eq, and } from 'drizzle-orm'
import { sleep_records } from '../db/schema'
import type { Database } from '../types/database'

type StatisticsServiceDeps = { db: Database }

export const createStatisticsService = ({ db }: StatisticsServiceDeps) => {
  // 1) 최근 days일간 일별 총 수면 시간 (분) 추이
  const getSleepTrend = async (userId: number, days = 30) => {
    const since = new Date()
    since.setDate(since.getDate() - days + 1)
    const rows = await db
      .select({
        date: sql<string>`strftime('%Y-%m-%d', ${sleep_records.startTime})`,
        totalMinutes: sql<number>`SUM(${sleep_records.durationMinutes})`
      })
      .from(sleep_records)
      .where(
        and(
          eq(sleep_records.userId, userId),
          sql`${sleep_records.startTime} >= ${since.toISOString()}`
        )
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`)
      .all()
    return rows // [{ date: "2025-05-10", totalMinutes: 480 }, …]
  }

  // 2) 요일별 평균 수면 시간 (분)
  const getWeekdayAverage = async (userId: number) => {
    const rows = await db
      .select({
        weekday: sql<number>`CAST(strftime('%w', ${sleep_records.startTime}) AS INTEGER)`,
        avgMinutes: sql<number>`AVG(${sleep_records.durationMinutes})`
      })
      .from(sleep_records)
      .where(eq(sleep_records.userId, userId))
      .groupBy(sql`1`)
      .orderBy(sql`1`)
      .all()
    return rows // [{ weekday: 0, avgMinutes: 360 }, …]
  }

  return { getSleepTrend, getWeekdayAverage }
}

export type StatisticsService = ReturnType<typeof createStatisticsService>
