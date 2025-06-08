import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import { createSleepRecordRoutes } from './sleepRecordRoutes'
import { createSessionRoutes } from './sessionRoutes'
import { createStatisticsRoutes } from './statisticsRouters'
import healthRoutes from './healthRoutes'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  // 헬스 체크 라우트
  fastify.register(healthRoutes, { prefix: '/api/health' })

  // 세션 관련 라우트
  await fastify.register(createSessionRoutes(context), { prefix: '/api/session' })

  // 사용자 관련 라우트
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })

  // 통계 관련 라우트
  fastify.register(createStatisticsRoutes(context), { prefix: '/api/statistics/' })

  // 수면 데이터 관련 라우트
  fastify.register(createSleepRecordRoutes(context), { prefix: '/api/sleep-records' })
}
