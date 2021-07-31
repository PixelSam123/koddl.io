'use strict'

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {import('point-of-view')} fastify
 */
module.exports = async (fastify, opts) => {
  fastify.get('/', (request, reply) => {
    // TODO SAM: Make the max players in room requirement configurable somewhere else (like app.js!). Also make it more fancy
    if (
      fastify.io.of('/').adapter.rooms.get(request.query.room) !== undefined &&
      fastify.io.of('/').adapter.rooms.get(request.query.room).size >= 10
    )
      reply.send(
        'Maaf, ruangan penuh. Maksimal pemain per ruangan: 10, silahkan masuk ruangan lain'
      )
    // Must have a 'room' URL parameter to enter the game
    else if ('room' in request.query && 'name' in request.query) reply.view('play/index')
    else reply.redirect('/')
  })
}
