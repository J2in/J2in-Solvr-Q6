import { FastifyRequest, FastifyReply } from 'fastify'
import { createErrorResponse, createSuccessResponse } from '../utils/response'
import type { StatisticsService } from '../services/statisticsService'

type StatsControllerDeps = { statisticsService: StatisticsService }

export const createStatisticsController = ({ statisticsService }: StatsControllerDeps) => {
  // GET /api/statistics/sleep-trend?days=30
  const sleepTrend = async (
    req: FastifyRequest<{ Querystring: { days?: string } }>,
    rep: FastifyReply
  ) => {
    try {
      const userId = req.user!.id
      const days = parseInt(req.query.days || '30', 10)
      const data = await statisticsService.getSleepTrend(userId, days)
      return rep.send(createSuccessResponse(data))
    } catch (err) {
      req.log.error(err)
      return rep.code(500).send(createErrorResponse('수면 추이 조회 실패'))
    }
  }

  // GET /api/statistics/weekday-average
  const weekdayAverage = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const userId = req.user!.id
      const data = await statisticsService.getWeekdayAverage(userId)
      return rep.send(createSuccessResponse(data))
    } catch (err) {
      req.log.error(err)
      return rep.code(500).send(createErrorResponse('요일별 평균 수면 조회 실패'))
    }
  }

  return { sleepTrend, weekdayAverage }
}
