'use strict'

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {import('point-of-view')} fastify
 */
module.exports = async (fastify, opts) => {
  fastify.get('/', (request, reply) => {
    reply.view('index')
  })
}
