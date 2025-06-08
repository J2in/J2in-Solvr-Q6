// server/src/routes/sessionRoutes.ts
import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createSessionController } from '../controllers/sessionController'

export const createSessionRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  const ctrl = createSessionController({
    sessionService: context.sessionService,
    userService: context.userService
  })

  fastify.post('/login', ctrl.login)
  fastify.delete('/logout', { preHandler: [fastify.authenticate] }, ctrl.logout)
  fastify.get('/me', { preHandler: [fastify.authenticate] }, ctrl.me)
}
