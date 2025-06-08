import { FastifyInstance } from 'fastify'
import type { AppContext } from '../types/context'
import { createStatisticsController } from '../controllers/statisticsController'

export const createStatisticsRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  // 인증이 필요하므로 preHandler 에 authenticate 사용
  fastify.get(
    '/sleep-trend',
    { preHandler: [fastify.authenticate] },
    createStatisticsController(context).sleepTrend
  )
  fastify.get(
    '/weekday-average',
    { preHandler: [fastify.authenticate] },
    createStatisticsController(context).weekdayAverage
  )
}
