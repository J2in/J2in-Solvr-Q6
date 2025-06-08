import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import { createSleepRecordRoutes } from './sleepRecordRoutes'
import healthRoutes from './healthRoutes'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  // 헬스 체크 라우트
  fastify.register(healthRoutes, { prefix: '/api/health' })

  // 세션 관련 라우트
  await fastify.register(createSessionRoutes(context), { prefix: '/api/session' })

  // 사용자 관련 라우트
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })

  // 수면 데이터 관련 라우트
  fastify.register(createSleepRecordRoutes(context), { prefix: '/api/sleep-records'})
}
