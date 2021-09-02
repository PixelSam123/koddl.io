const EventEmitter = require('events').EventEmitter
const helper = require('./helper')

module.exports = class extends EventEmitter {
  #turnDuration
  #endTurnScreenDuration
  #startRevealingCharsAfter
  #roundCount
  #pickWordDuration
  #pickListCount
  #basePoints
  #pointsDecrementer
  #pointsLowLimit

  #gameJoinCount = 0
  #playerList = new Map()
  #playerIDArray = []

  #visualTimerObject
  #pickWordTimeoutObject
  #endTurnTimeoutObject

  #currentRoundNumber = 0
  #currentPlayerTurnIndex

  #turnIsOngoing = false
  #currentTurnPlayerList = new Map()
  #currentWord = null
  #currentPickList
  #currentTurnPoints

  #hiddenWord

  constructor(
    turnDuration = 65,
    endTurnScreenDuration = 5,
    startRevealingCharsAfter = 15,
    roundCount = 3,
    pickWordDuration = 15,
    pickListCount = 3,
    basePoints = 20,
    pointsDecrementer = 1,
    pointsLowLimit = 10
  ) {
    super()
    this.#turnDuration = turnDuration
    this.#endTurnScreenDuration = endTurnScreenDuration
    this.#startRevealingCharsAfter = startRevealingCharsAfter
    this.#roundCount = roundCount
    this.#pickWordDuration = pickWordDuration
    this.#pickListCount = pickListCount
    this.#basePoints = basePoints
    this.#pointsDecrementer = pointsDecrementer
    this.#pointsLowLimit = pointsLowLimit
  }

  #refreshPickList() {
    this.#currentPickList = helper.pickWords(this.#pickListCount)
  }
  #refreshTurnPoints() {
    this.#currentTurnPoints = this.#basePoints
  }

  getCurrentPlayerInTurnID() {
    return this.#playerIDArray[this.#currentPlayerTurnIndex]
  }

  #startVisualTimer(duration) {
    // Also sends the hidden word each tick. I'll think of a better function name later
    let durationLeft = duration
    this.emit('visual-timer-tick', durationLeft, this.#hiddenWord)

    this.#visualTimerObject = setInterval(() => {
      durationLeft--
      if (this.#currentWord !== null && durationLeft <= this.#turnDuration - this.#startRevealingCharsAfter)
        this.#hiddenWord = helper.unhideRandomCharacterByChance(this.#hiddenWord, this.#currentWord)
      this.emit('visual-timer-tick', durationLeft, this.#hiddenWord)
    }, 1000)
  }
  #stopVisualTimer() {
    clearInterval(this.#visualTimerObject)
  }

  #startPickWordTimeout() {
    this.#pickWordTimeoutObject = setTimeout(() => {
      this.pickWord(this.getCurrentPlayerInTurnID(), 0)
    }, this.#pickWordDuration * 1000)
  }
  #startEndTurnTimeout() {
    this.#endTurnTimeoutObject = setTimeout(() => {
      this.#endTurn()
    }, this.#turnDuration * 1000)
  }

  #newRound() {
    this.#currentRoundNumber++
    this.#currentPlayerTurnIndex = 0
  }

  #startTurn() {
    if (!this.#turnIsOngoing) {
      this.#turnIsOngoing = true

      this.#currentTurnPlayerList.clear()
      this.#refreshPickList()
      this.#refreshTurnPoints()

      this.#currentTurnPlayerList.set(this.getCurrentPlayerInTurnID(), {
        currentPoints: 0,
      })
      this.emit(
        'turn-start',
        this.getCurrentPlayerInTurnID(),
        this.#currentPickList,
        this.#playerList.get(this.getCurrentPlayerInTurnID()).displayName
      )

      this.#startVisualTimer(this.#pickWordDuration)
      // If player didn't pick the word within the pick word duration, do it for him
      this.#startPickWordTimeout()
    }
  }
  pickWord(id, index) {
    if (id === this.getCurrentPlayerInTurnID() && this.#currentWord === null) {
      this.#stopVisualTimer()
      clearTimeout(this.#pickWordTimeoutObject)

      this.#currentWord = this.#currentPickList[index]
      this.emit('word-picked', this.getCurrentPlayerInTurnID(), this.#currentWord)
      this.#hiddenWord = helper.hideWordWithUnderscore(this.#currentWord)

      this.#startVisualTimer(this.#turnDuration)
      // If not all players answered within the turn duration, end it for them
      this.#startEndTurnTimeout()
    }
  }
  #endTurn(playerInTurnDisconnected = false) {
    if (this.#turnIsOngoing) {
      this.#turnIsOngoing = false

      this.#stopVisualTimer()
      clearTimeout(this.#endTurnTimeoutObject)

      this.emit(
        'turn-end',
        Array.from(this.#currentTurnPlayerList).map(([id, info]) => ({
          displayName: this.#playerList.get(id).displayName,
          currentPoints: info.currentPoints,
        })),
        this.#currentWord
      )
      this.#currentWord = null

      // Checks for starting a new turn, a new round OR ending the game
      this.#startVisualTimer(this.#endTurnScreenDuration)
      if (this.#currentPlayerTurnIndex === this.#playerIDArray.length - 1) {
        // Condition above: if the current player turn index is the last one in the round
        setTimeout(() => {
          if (this.#currentRoundNumber === this.#roundCount) {
            // Reset the entire game (points, position, round number) then start a new round and new turn.
            // TODO SAM: Will use the end turn screen until I implement a game ending screen.
            this.#playerList.forEach((info, id) => {
              this.#playerList.get(id).points = 0
              this.#playerList.get(id).position = 0
            })
            this.#currentRoundNumber = 0
          }
          this.#stopVisualTimer()
          // Reset current player turn index to 0 (with the newRound function), then start a new turn
          this.#newRound()
          this.#startTurn()
        }, this.#endTurnScreenDuration * 1000)
      } else {
        setTimeout(() => {
          this.#stopVisualTimer()
          // Increment current player turn index if turned wasn't ended because the player in turn disconnected, then start a new turn
          if (!playerInTurnDisconnected) this.#currentPlayerTurnIndex++
          this.#startTurn()
        }, this.#endTurnScreenDuration * 1000)
      }
    }
  }

  #addPoints(id) {
    // Answerer
    this.#currentTurnPlayerList.set(id, {
      currentPoints: this.#currentTurnPoints,
    })
    this.#playerList.get(id).points += this.#currentTurnPoints

    // Player currently in turn (coder)
    this.#currentTurnPlayerList.get(this.getCurrentPlayerInTurnID()).currentPoints += this.#pointsDecrementer
    this.#playerList.get(this.getCurrentPlayerInTurnID()).points += this.#pointsDecrementer

    // Calculate positions (TEMPORARY IMPEMENTATION, same points will result in a draw for now.)
    const positionsSet = new Set()
    this.#playerList.forEach((info, id) => {
      positionsSet.add(info.points)
    })
    const positionsArray = Array.from(positionsSet).sort((a, b) => b - a)
    this.#playerList.forEach((info, id) => {
      this.#playerList.get(id).position = positionsArray.indexOf(info.points) + 1
    })

    // If everybody has answered, end the turn
    if (this.#currentTurnPlayerList.size === this.#playerList.size) this.#endTurn()

    if (this.#currentTurnPoints > this.#pointsLowLimit) this.#currentTurnPoints -= this.#pointsDecrementer
  }

  addPlayer(id, displayName) {
    this.#playerList.set(id, {
      displayName,
      points: 0,
      position: 0,
    })
    this.#playerIDArray = Array.from(this.#playerList.keys())
    this.#gameJoinCount++
    if (this.#gameJoinCount === 2) {
      // Optional: && this.#playerList.size ===
      this.#newRound()
      this.#startTurn()
    }
  }
  removePlayer(id) {
    if (id === this.getCurrentPlayerInTurnID()) this.#endTurn(true)
    this.#currentTurnPlayerList.delete(id)
    this.#playerList.delete(id)
    this.#playerIDArray = Array.from(this.#playerList.keys())
  }

  hasPlayerAnswered(id) {
    return this.#turnIsOngoing && this.#currentTurnPlayerList.has(id) && id !== this.getCurrentPlayerInTurnID()
  }
  checkPlayerMessage(id, message) {
    if (id === this.getCurrentPlayerInTurnID() || this.hasPlayerAnswered(id)) return false
    if (message.toLowerCase() === this.#currentWord) {
      this.#addPoints(id)
      this.emit('correct-answer', this.#playerList.get(id).displayName)
      return true
    }
    return false
  }

  getPlayersArray() {
    // For displaying players in the sidebar
    return Array.from(this.#playerList.values()).map((player, index) => ({
      displayName: player.displayName,
      points: player.points,
      position: player.position,
      isInTurn: index === this.#currentPlayerTurnIndex,
    }))
  }
  getRoundCount() {
    // For the 'Round ... of ...' text
    return [this.#currentRoundNumber, this.#roundCount]
  }
}
// TODO SAM: Implement this somewhere! Make a (You) name marker.
