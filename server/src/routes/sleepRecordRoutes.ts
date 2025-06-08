// server/src/routes/sleepRecordRoutes.ts
import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createSleepRecordController } from '../controllers/sleepRecordController'

export const createSleepRecordRoutes =
  (context: AppContext) => async (fastify: FastifyInstance) => {
    const ctrl = createSleepRecordController({ sleepRecordService: context.sleepRecordService })

    // 1) 모든 수면 기록 조회 (관리자용)
    fastify.get('/', ctrl.getAllSleepRecords)

    // 2) 사용자별 기록 조회
    // TODO: sleep-records?userId=1이런식으로 파라미터로 하도록 수정하기
    fastify.get('/user/:userId', ctrl.getSleepRecordsByUserId)

    // 3) 단일 기록 조회
    fastify.get('/:id', ctrl.getSleepRecordById)

    // 4) 기록 생성
    fastify.post('/', ctrl.createSleepRecord)

    // 5) 기록 수정
    fastify.put('/:id', ctrl.updateSleepRecord)

    // 6) 기록 삭제
    fastify.delete('/:id', ctrl.deleteSleepRecord)
  }
