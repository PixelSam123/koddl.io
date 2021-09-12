import type { NextPage } from 'next'
import type { ChangeEventHandler, FormEventHandler } from 'react'
import type { OnChange } from '@monaco-editor/react'
import type {
  PlayerInfo,
  TurnResults,
  ChatInfo,
  EditorLanguages,
} from '../../components/GameWindow'

import Head from 'next/head'
import GameWindow from '../../components/GameWindow'
import SocketContext from '../../context/SocketContext'

import { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'

const Room: NextPage = () => {
  const router = useRouter()
  const socket = useContext(SocketContext)

  const handleEditorOnChange: OnChange = (value) => {
    if (pickedWord) socket.emit('client-send-code', value)
  }
  const handleLangSelectorOnChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setEditorLanguage(e.target.value as EditorLanguages)
    if (pickedWord) socket.emit('client-send-language', e.target.value)
  }

  const [editorValue, setEditorValue] = useState('')
  const [editorAndLangSelectorIsReadOnly, setEditorAndLangSelectorIsReadOnly] = useState(true)
  const [editorLanguage, setEditorLanguage] = useState<EditorLanguages>('javascript')

  const [time, setTime] = useState(65)
  const [round, setRound] = useState(1)
  const [maxRound, setMaxRound] = useState(3)

  const [hiddenWord, setHiddenWord] = useState('________')

  const [playersArray, setPlayersArray] = useState<PlayerInfo[]>([
    {
      displayName: 'Example',
      points: 38,
      position: 1,
      isInTurn: true,
    },
  ])
  const [chatArray, setChatArray] = useState<ChatInfo[]>([
    {
      type: 'message-info',
      displayName: 'koddl.io',
      content: 'Welcome!',
    },
  ])
  const [pickList, setPickList] = useState<string[]>([])

  const [chatInputValue, setChatInputValue] = useState('')

  const handleChatSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (chatInputValue) {
      socket.emit('client-send-message', chatInputValue)
      setChatInputValue('')
    }
  }
  const pickWord = (idx: number) => {
    socket.emit('client-send-picked-word', idx)
  }

  const [waitingForPlayers, setWaitingForPlayers] = useState(true)
  const [wordChooser, setWordChooser] = useState('')
  const [pickedWord, setPickedWord] = useState('')
  const [turnPointsList, setTurnPointsList] = useState<TurnResults[]>([])
  const [lastTurnAnswer, setLastTurnAnswer] = useState('')

  useEffect(() => {
    const { room, name } = router.query
    console.log(room) // HEY THERE, CONSOLE LOG HERE

    if (room !== undefined && name) {
      socket.emit('client-send-room-id-and-name', room[0], name)

      socket.on('server-send-reject-game-join', () => {
        router.replace('/')
      })

      socket.on('server-send-code', (codeEditorValue) => {
        setEditorValue(codeEditorValue)
      })

      socket.on('server-send-language', (incomingLanguage: EditorLanguages) => {
        setEditorLanguage(incomingLanguage)
      })

      socket.on('server-send-message', (incomingChatMessage: ChatInfo) => {
        setChatArray((prevChatArray) => [...prevChatArray, incomingChatMessage])
        chatlogRef.current!.scrollTop = chatlogRef.current!.scrollHeight
      })

      socket.on('server-send-timer-tick', (timerNumber: number, hiddenWord: string) => {
        setTime(timerNumber)
        setHiddenWord(hiddenWord)
      })

      socket.on('server-send-roundcount', ([incomingCurrentRound, maxRoundCount]: number[]) => {
        setRound(incomingCurrentRound)
        setMaxRound(maxRoundCount)
      })

      socket.on('server-send-choosing-word', (chooserDisplayName) => {
        setTurnPointsList([])
        setEditorValue('')
        setWordChooser(chooserDisplayName)
      })

      socket.on('server-send-picklist', (incomingPickList: string[]) => {
        setWordChooser('')
        setPickList(incomingPickList)
      })

      socket.on('server-send-hide-choosing-word', () => {
        setWordChooser('')
      })

      socket.on('server-send-hide-picklist', (pickedWord: string) => {
        setPickList([])
        setPickedWord(pickedWord)
        setEditorAndLangSelectorIsReadOnly(false)
      })

      socket.on(
        'server-send-turn-pointslist',
        (incomingTurnPointsList: TurnResults[], turnAnswer: string) => {
          setPickedWord('')
          setLastTurnAnswer(turnAnswer)
          setTurnPointsList(incomingTurnPointsList)
          setEditorAndLangSelectorIsReadOnly(true)
        }
      )

      socket.on('server-send-playerlist', (playerList: PlayerInfo[]) => {
        setPlayersArray(playerList)
        if (playerList.length > 1) setWaitingForPlayers(false)
      })
    }

    return () => {
      console.log('socket turned off') // HEY THERE, CONSOLE.LOG HERE
      socket.off()
      socket.emit('leave')
    }
  }, [socket, router])

  const chatlogRef = useRef<null | HTMLDivElement>(null)

  return (
    <>
      <Head>
        <title>koddl.io - Play</title>
      </Head>
      <GameWindow
        timerTime={time}
        currentRound={round}
        maxRound={maxRound}
        pickedWord={pickedWord}
        hiddenWord={hiddenWord}
        editorLanguage={editorLanguage}
        editorAndLangSelectorIsReadOnly={editorAndLangSelectorIsReadOnly}
        langSelectorOnChange={handleLangSelectorOnChange}
        playerListArray={playersArray}
        isWaitingForPlayers={waitingForPlayers}
        wordChooserPlayer={wordChooser}
        wordChoiceList={pickList}
        chooseWordFunction={pickWord}
        turnResultsList={turnPointsList}
        previousTurnAnswer={lastTurnAnswer}
        editorOnChange={handleEditorOnChange}
        editorValue={editorValue}
        chatlogRef={chatlogRef}
        chatArray={chatArray}
        chatFormOnSubmit={handleChatSubmit}
        chatInputValue={chatInputValue}
        chatInputValueSetter={setChatInputValue}
      />
    </>
  )
}

export default Room
