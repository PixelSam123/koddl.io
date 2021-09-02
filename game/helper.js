'use strict'

module.exports = {
  // Random word pool
  wordList: [
    'hello world',
    'variabel',
    'konstanta',
    'pengulangan',
    'pengkondisian',
    'rekursif',
    'penanganan eksepsi',
    'fungsi',
    'fungsi anonim',
    'array',
    'regex',
    'objek',
    'kelas',
    'konstruktor',
    'getter dan setter',
    'instansiasi',
    'enkapsulasi',
    'abstraksi',
    'pemrograman berorientasi objek',
    'pemrograman fungsional',
    'ajax',
    'document object model',
    'jangan lupa titik koma',
    'stack overflow',
    'pemrograman prosedural',
    'immediately invoked function expression',
    'higher-order function',
    'strict equality',
    'closure',
    'function expression',
    'function declaration',
    'nullish coalescing',
    'optional chaining',
    'truthy',
    'falsy',
    'get request',
    'post request',
    'dynamic module import',
    'loop label',
  ],

  // Functions that enable the hiding & unhiding functions to work
  randomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  replaceCharacter(string, index, replacementChar) {
    return string.substr(0, index) + replacementChar + string.substr(index + replacementChar.length)
  },

  pickWords(count, sourceList = this.wordList) {
    const words = []
    for (let i = 0; i < count; i++) {
      do {
        words[i] = sourceList[this.randomIntInclusive(0, sourceList.length - 1)]
      } while (words.some((word, index) => word === words[i] && index !== i))
    }
    return words
  },

  // Functions for hiding words & unhiding characters
  // Use a regex playground (ex. https://regexr.com/) to check what the regex means
  hideWordWithUnderscore(word) {
    return word.replace(/[^\s]/g, '_')
  },
  unhideRandomCharacter(hiddenWord, originalWord) {
    if (hiddenWord === originalWord) return hiddenWord
    let chosenIndex
    do {
      chosenIndex = this.randomIntInclusive(0, hiddenWord.length - 1)
    } while (/[^_]/.test(hiddenWord[chosenIndex]))
    return this.replaceCharacter(hiddenWord, chosenIndex, originalWord[chosenIndex])
  },

  // Chance-based function for unhiding characters
  unhideRandomCharacterByChance(
    hiddenWord,
    originalWord,
    oneInX = 7,
    minHiddenCharsPercentage = 0.33
  ) {
    if (
      this.randomIntInclusive(1, oneInX) === 1 &&
      hiddenWord.match(/_|\s/g).length > Math.ceil(hiddenWord.length * minHiddenCharsPercentage)
    )
      return this.unhideRandomCharacter(hiddenWord, originalWord)
    return hiddenWord
  },
}
