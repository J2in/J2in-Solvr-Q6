import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createAiController } from '../controllers/aiController'

export const createAiRoutes = (ctx: AppContext) => async (fastify: FastifyInstance) => {
  const ctrl = createAiController({ aiService: ctx.aiService })
  fastify.get('/advice', { preHandler: [fastify.authenticate] }, ctrl.summary)
}
