import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import env from '../config/env'
import { users, sleep_records } from './schema'
import { UserRole } from '../types'

import { upUsers } from './migrations/users'
import { upSleepRecords } from './migrations/sleepRecords'
import { upSessions } from './migrations/sessions'

import { seedDummyData } from './dummyData'

// 데이터베이스 디렉토리 생성 함수
async function ensureDatabaseDirectory() {
  const dir = dirname(env.DATABASE_URL)
  try {
    await mkdir(dir, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}
// 데이터베이스 마이그레이션 및 초기 데이터 삽입
async function runMigration() {
  try {
    // 데이터베이스 디렉토리 생성
    await ensureDatabaseDirectory()

    // 데이터베이스 연결
    const sqlite = new Database(env.DATABASE_URL)
    const db = drizzle(sqlite)

    // 스키마 생성
    console.log('데이터베이스 스키마 생성 중...')

    upUsers(sqlite)
    upSleepRecords(sqlite)
    upSessions(sqlite)

    // 기존 데이터 삭제
    //    foreign key 제약이 걸려 있으면 순서 지켜서 삭제하세요.
    sqlite.exec(`
    DELETE FROM sleep_records;
    DELETE FROM sessions;
    DELETE FROM users;
  `)

    // 초기 데이터 삽입
    console.log('초기 데이터 삽입 중...')

    await seedDummyData(sqlite)

    console.log('데이터베이스 마이그레이션이 완료되었습니다.')
  } catch (error) {
    console.error('데이터베이스 마이그레이션 중 오류가 발생했습니다:', error)
    process.exit(1)
  }
}

// 스크립트가 직접 실행된 경우에만 마이그레이션 실행
if (require.main === module) {
  runMigration()
}

export default runMigration
