'use strict'
require('dotenv').config()

const fastify = require('fastify').default({
  logger: process.env.NODE_ENV !== 'production',
})
const path = require('path')

// Load Socket.IO and io.js (/play page handler) module which uses it
fastify.register(require('fastify-socket.io'), {
  serveClient: false,
})
fastify.register(require('./game/io'))

// Serve static files (favicon, public files)
fastify.register(require('fastify-favicon'), {
  path: path.join(__dirname, 'public'),
})
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

// Enable NextJS integration
fastify
  .register(require('fastify-nextjs'), { dev: process.env.NODE_ENV !== 'production' })
  .after(() => {
    fastify.next('/*')
  })

// Autoload non-Next routes
fastify.register(require('fastify-autoload'), {
  dir: path.join(__dirname, 'routes'),
})

// Run the server!
fastify.listen(process.env.PORT || 3000, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
