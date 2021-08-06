'use strict'

// In the future, we can load constants with dotenv (npm)
const PORT = process.env.PORT || 80

/** @type {import('fastify').FastifyInstance} */
const fastify = require('fastify')({
  logger: true,
})
const path = require('path')

// Load Socket.IO and game.js (/play page handler) module which uses it
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

// Enable Nunjucks usage
fastify.register(require('point-of-view'), {
  engine: {
    nunjucks: require('nunjucks'),
  },
  root: path.join(__dirname, 'views'),
})

// Autoload routes
fastify.register(require('fastify-autoload'), {
  dir: path.join(__dirname, 'routes'),
})

// Run the server!
fastify.listen(PORT || 3000, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
