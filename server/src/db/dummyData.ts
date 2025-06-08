import { Database } from 'better-sqlite3'
import { faker } from '@faker-js/faker'
//450kb로 faker 패키지 크기가 큰데 서버사이드 코드라 클라이언트에 영향은 없다고 함.
import { UserRole } from '../types'

// 더미 사용자 및 수면 기록 데이터를 생성하는 스크립트
export async function seedDummyData(sqlite: Database) {
  /** rawHour—24h 기준 실수(예: 22.5 → 22:30) 를 [시, 분] 튜플로 변환 */
  function toHourMinuteTuple(rawHour: number): [number, number] {
    const hour = Math.floor(rawHour) % 24
    const minute = Math.floor((rawHour % 1) * 60)
    return [hour, minute]
  }

  // 1) 사용자 추가
  const userStmt = sqlite.prepare(`
    INSERT OR IGNORE INTO users (name, email, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `)

  // UTC 자정 타임스탬프 (오늘)
  const now = new Date().toISOString()
  const today = new Date()
  const baseUtcMidnight = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

  const userList = [
    { name: '올빼미', email: 'owl@example.com', role: UserRole.USER },
    { name: '정말잘자요', email: 'goodsleep@example.com', role: UserRole.USER },
    { name: '김직장인', email: 'kimworker@example.com', role: UserRole.USER }
  ]
  for (const u of userList) {
    userStmt.run(u.name, u.email, u.role, now, now)
  }

  // 각 사용자 ID 가져오기
  const rows = sqlite.prepare(`SELECT id, email FROM users`).all()
  const userMap: Record<string, number> = {}
  for (const row of rows as any[]) {
    userMap[row.email] = row.id
  }

  // 2) 수면 기록 추가
  const sleepStmt = sqlite.prepare(`
    INSERT INTO sleep_records
      (user_id, start_time, end_time, duration_minutes, quality, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const makeRandom = (min: number, max: number) => min + Math.random() * (max - min)

  // — 올빼미: UTC 기준 6–7시 → 12–14시, 30일치
  for (let i = 0; i < 30; i++) {
    const dayUtc = new Date(baseUtcMidnight - i * 24 * 60 * 60 * 1000)
    const dateStr = dayUtc.toISOString().slice(0, 10)
    const [sh, sm] = toHourMinuteTuple(makeRandom(6, 7))
    const [eh, em] = toHourMinuteTuple(makeRandom(12, 14))

    const start = new Date(
      Date.UTC(dayUtc.getUTCFullYear(), dayUtc.getUTCMonth(), dayUtc.getUTCDate(), sh, sm)
    )
    const end = new Date(
      Date.UTC(dayUtc.getUTCFullYear(), dayUtc.getUTCMonth(), dayUtc.getUTCDate(), eh, em)
    )
    const duration = Math.round((end.getTime() - start.getTime()) / 60000)

    sleepStmt.run(
      userMap['owl@example.com'],
      start.toISOString(),
      end.toISOString(),
      duration,
      Math.ceil(makeRandom(2, 5)),
      '올빼미',
      now,
      now
    )
  }

  // — 정말잘자요: UTC 기준 22–24시 → 7–9시, 40일치
  for (let i = 0; i < 40; i++) {
    const dayUtc = new Date(baseUtcMidnight - i * 24 * 60 * 60 * 1000)
    const [sh, sm] = toHourMinuteTuple(makeRandom(22, 24))
    const [eh, em] = toHourMinuteTuple(makeRandom(7, 9))

    // 시작일자 UTC
    const start = new Date(
      Date.UTC(dayUtc.getUTCFullYear(), dayUtc.getUTCMonth(), dayUtc.getUTCDate(), sh, sm)
    )
    // 종료는 다음 날일 수 있으므로
    let end = new Date(
      Date.UTC(dayUtc.getUTCFullYear(), dayUtc.getUTCMonth(), dayUtc.getUTCDate(), eh, em)
    )
    if (end <= start) end.setUTCDate(end.getUTCDate() + 1)

    const duration = Math.round((end.getTime() - start.getTime()) / 60000)
    sleepStmt.run(
      userMap['goodsleep@example.com'],
      start.toISOString(),
      end.toISOString(),
      duration,
      Math.ceil(makeRandom(3, 5)),
      '정말잘자요',
      now,
      now
    )
  }

  // — 김직장인: 평일 23–1시 → 6:40–7:10, 주말 1–3시 → 10–11:59, 60일치
  for (let i = 0; i < 60; i++) {
    // 1) 기준이 되는 UTC 자정
    const dayUtc = new Date(baseUtcMidnight - i * 24 * 60 * 60 * 1000)

    // 2) 주말 여부
    const weekday = dayUtc.getUTCDay()
    const isWeekend = weekday === 0 || weekday === 6

    // 3) 랜덤 시간 범위 가져오기
    const rawStart = makeRandom(22, 23)
    const rawEnd = makeRandom(6.667, 7.167)

    // 4) 날짜 객체에 시간 세팅 (UTC)
    const start = new Date(dayUtc.getTime())
    const [sh, sm] = toHourMinuteTuple(rawStart)
    start.setUTCHours(sh, sm, 0, 0)

    const end = new Date(dayUtc.getTime())
    const [eh, em] = toHourMinuteTuple(rawEnd)
    end.setUTCHours(eh, em, 0, 0)

    // 5) 만약 end ≤ start 면 다음 날로
    if (end <= start) {
      end.setUTCDate(end.getUTCDate() + 1)
    }

    // 6) 주말엔 기상 시간에 2~3시간 추가
    if (isWeekend) {
      const extraMins = Math.round(makeRandom(120, 180))
      end.setTime(end.getTime() + extraMins * 60_000)
    }

    // 7) 삽입
    const duration = Math.round((end.getTime() - start.getTime()) / 60000)
    sleepStmt.run(
      userMap['kimworker@example.com'],
      start.toISOString(),
      end.toISOString(),
      duration,
      Math.ceil(makeRandom(2, 5)),
      faker.lorem.sentence(),
      now,
      now
    )
  }

  console.log('✅ 더미 사용자 및 수면 기록이 삽입되었습니다.')
}
