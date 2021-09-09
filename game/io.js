'use strict'

const Game = require('./Game')

/**
 * @param {Object} fastify
 * @param {import('socket.io').Server} fastify.io
 * @param {import('pino').Logger} fastify.log
 */
module.exports = async (fastify, opts) => {
  // Contains all current Game instances
  const games = new Map()

  fastify.io.on('connection', (socket) => {
    socket.on('client-send-create-room-request', (createRoomOpts) => {
      // Condition: Nobody has joined the room yet. Instantiate Game in as a new map value if so
      if (fastify.io.of('/').adapter.rooms.get(createRoomOpts.createRoomId) === undefined) {
        games.set(
          createRoomOpts.createRoomId,
          new Game(
            createRoomOpts.turnDuration,
            5,
            15,
            createRoomOpts.roundCount,
            15,
            createRoomOpts.pickListCount
          )
        )
        console.log(`GAME INSTED room: ${createRoomOpts.createRoomId}`)
        console.log(games)

        /** @type {import('./Game')} */
        const game = games.get(createRoomOpts.createRoomId)

        // Add Game instance-exclusive event listeners. Because we want to do this only once.
        game.on('turn-start', (currentTurnPlayer, pickList, chooserDisplayName) => {
          fastify.io
            .to(createRoomOpts.createRoomId)
            .emit('server-send-playerlist', game.getPlayersArray())
          fastify.io
            .to(createRoomOpts.createRoomId)
            .emit('server-send-choosing-word', chooserDisplayName)
          fastify.io.to(currentTurnPlayer).emit('server-send-picklist', pickList)
          fastify.io
            .to(createRoomOpts.createRoomId)
            .emit('server-send-roundcount', game.getRoundCount())
        })
        game.on('word-picked', (currentTurnPlayer, pickedWord) => {
          fastify.io.to(createRoomOpts.createRoomId).emit('server-send-hide-choosing-word')
          fastify.io.to(currentTurnPlayer).emit('server-send-hide-picklist', pickedWord)
        })

        game.on('turn-end', (turnPointsList, turnAnswer) => {
          fastify.io
            .to(createRoomOpts.createRoomId)
            .emit('server-send-turn-pointslist', turnPointsList, turnAnswer)
        })
        game.on('correct-answer', (answererDisplayName) => {
          fastify.io
            .to(createRoomOpts.createRoomId)
            .emit('server-send-playerlist', game.getPlayersArray())
          fastify.io.to(createRoomOpts.createRoomId).emit('server-send-message', {
            type: 'message-success',
            displayName: answererDisplayName,
            content: 'berhasil menjawab!',
          })
        })
        game.on('visual-timer-tick', (timerNumber, hiddenWord) => {
          fastify.io
            .to(createRoomOpts.createRoomId)
            .emit('server-send-timer-tick', timerNumber, hiddenWord)
        })
      }
    })

    socket.on('client-send-room-id-and-name', (roomId, requestedName) => {
      const roomName = roomId
      socket.join(roomName)

      const displayName = requestedName

      /** @type {import('./Game')} */
      const game = games.get(roomName)
      // Temporary hardcoded 15 player limit
      if (game === undefined || fastify.io.of('/').adapter.rooms.get(roomName).size > 15) {
        fastify.io.to(socket.id).emit('server-send-reject-game-join')
        socket.leave(roomName)
      } else {
        // Add player to game instance and emit to player the round number, then emit globally the playerlist and 'Username connected!' message
        game.addPlayer(socket.id, displayName)
        fastify.io.to(socket.id).emit('server-send-roundcount', game.getRoundCount())
        fastify.io.to(roomName).emit('server-send-playerlist', game.getPlayersArray())
        fastify.io.to(roomName).emit('server-send-message', {
          type: 'message-info',
          displayName,
          content: 'tersambung!',
        })

        // Handle the client sending code and language choice from the code editor
        // TEMPORARY IMPLEMENTATION: Might be unoptimized.
        socket.on('client-send-code', (codeEditorValue) => {
          if (socket.id === game.getCurrentPlayerInTurnID())
            socket.to(roomName).emit('server-send-code', codeEditorValue)
        })
        socket.on('client-send-language', (codeEditorLanguage) => {
          if (socket.id === game.getCurrentPlayerInTurnID())
            socket.to(roomName).emit('server-send-language', codeEditorLanguage)
        })

        // Handle the client picking the word to play
        socket.on('client-send-picked-word', (pickedWordIndex) => {
          game.pickWord(socket.id, pickedWordIndex)
        })

        // Handle chat messages from client
        socket.on('client-send-message', (content) => {
          if (!game.checkPlayerMessage(socket.id, content)) {
            fastify.io.to(roomName).emit('server-send-message', {
              type: game.hasPlayerAnswered(socket.id) ? 'message-passed' : 'message',
              displayName,
              content,
            })
          }
        })

        // Emit playerlist when a player leaves/disconnects, delete Game instance if room goes empty.
        const leaveOrDisconnectHandler = (reason) => {
          if (!reason) socket.leave(roomName) // Please, later check whether or not the immediate room emptiness check below is reliable
          socket.removeAllListeners('client-send-code')
          socket.removeAllListeners('client-send-language')
          socket.removeAllListeners('client-send-picked-word')
          socket.removeAllListeners('client-send-message')
          socket.removeAllListeners('leave')
          socket.removeAllListeners('disconnect')
          // Note: use socket.eventNames() to list events currently being listened to
          if (fastify.io.of('/').adapter.rooms.get(roomName) === undefined) {
            game.stop()
            games.delete(roomName)
            console.log(`GAME DSTRYD room: ${roomName}`)
            console.log(games)
          } else {
            game.removePlayer(socket.id)
            fastify.io.to(roomName).emit('server-send-playerlist', game.getPlayersArray())
            fastify.io.to(roomName).emit('server-send-message', {
              type: 'message-info',
              displayName,
              content: 'keluar!',
            })
          }
        }
        socket.on('leave', leaveOrDisconnectHandler)
        socket.on('disconnect', leaveOrDisconnectHandler)
      }
    })
  })

  // Listen to adapter events just for logging purposes
  fastify.io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`ROOM JOIN   room: ${room} id: ${id}`)
  })
  fastify.io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`ROOM LEAVE  room: ${room} id: ${id}`)
  })
  fastify.io.of('/').adapter.on('create-room', (room) => {
    console.log(`ROOM CREATE room: ${room}`)
  })
  fastify.io.of('/').adapter.on('delete-room', (room) => {
    console.log(`ROOM CLOSED room: ${room}`)
  })
}
