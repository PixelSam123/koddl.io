import type { NextPage } from 'next'
import type { ChangeEventHandler, FormEventHandler } from 'react'
import type { OnChange, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

import Head from 'next/head'
import Input from '../../components/Input'
import Button from '../../components/Button'
import SocketContext from '../../context/SocketContext'

import { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import Editor from '@monaco-editor/react'

interface PlayerInfo {
  displayName: string
  points: number
  position: number
  isInTurn: boolean
}
interface ChatInfo {
  type: string
  displayName: string
  content: string
}
interface TurnPoints {
  displayName: string
  currentPoints: number
}

const Room: NextPage = () => {
  const router = useRouter()
  const socket = useContext(SocketContext)

  const editorRef = useRef<null | editor.IStandaloneCodeEditor>(null)
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }
  const handleEditorOnChange: OnChange = (value) => {
    if (pickedWord) socket.emit('client-send-code', value)
  }
  const handleLangSelectorOnChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setEditorLanguage(e.target.value)
    if (pickedWord) socket.emit('client-send-language', e.target.value)
  }

  const [editorValue, setEditorValue] = useState('')
  const [editorAndLangSelectorIsReadOnly, setEditorAndLangSelectorIsReadOnly] = useState(true)
  const [editorLanguage, setEditorLanguage] = useState('javascript')

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

  const [chatfieldInput, setChatfieldInput] = useState('')

  const handleChatSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (chatfieldInput) {
      socket.emit('client-send-message', chatfieldInput)
      setChatfieldInput('')
    }
  }
  const pickWord = (idx: number) => {
    socket.emit('client-send-picked-word', idx)
  }

  const [waitingForPlayers, setWaitingForPlayers] = useState(true)
  const [wordChooser, setWordChooser] = useState('')
  const [pickedWord, setPickedWord] = useState('')
  const [turnPointsList, setTurnPointsList] = useState<TurnPoints[]>([])
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

      socket.on('server-send-language', (incomingLanguage: string) => {
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

      socket.on('server-send-roundcount', ([currentRound, maxRoundCount]: number[]) => {
        setRound(currentRound)
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
        (incomingTurnPointsList: TurnPoints[], turnAnswer: string) => {
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
      <div
        className="self-center grid font-mono
      w-screen max-w-screen-xl h-[37.5rem] max-h-screen overflow-y-hidden"
      >
        <div className="col-span-3 flex items-center justify-between gap-x-2 bg-yellow-50">
          <div className="w-max flex items-center">
            <p className="w-10 text-center text-3xl">{time}</p>
            <p>
              Round {round} of {maxRound}
            </p>
          </div>
          <p className="w-max text-lg tracking-widest">{pickedWord || hiddenWord}</p>
          <div className="w-max">
            {pickedWord && 'Your Turn '}
            <select
              value={editorLanguage}
              disabled={editorAndLangSelectorIsReadOnly}
              onChange={handleLangSelectorOnChange}
              className="h-9 py-0"
            >
              <option value="javascript">JavaScript</option>
              <option value="php">PHP</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>
        <div className="bg-yellow-200 w-max pr-2.5 max-h-[512px] overflow-y-auto">
          {playersArray.map((player, idx) => (
            <div key={idx} className="my-1 flex items-center leading-[1.125rem]">
              <p className={`w-10 text-center ${player.isInTurn ? 'font-bold' : ''}`}>
                #{player.position}
              </p>
              <div>
                <p className={player.isInTurn ? 'font-bold' : ''}>{player.displayName}</p>
                <p>Points: {player.points}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative min-w-0 min-h-0">
          {waitingForPlayers && (
            <p
              className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
              flex items-center justify-center"
            >
              Waiting for players...
            </p>
          )}
          {wordChooser && (
            <p
              className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
                        flex items-center justify-center"
            >
              {wordChooser} is choosing a word...
            </p>
          )}
          {!!pickList.length && (
            <div
              className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
                        flex flex-col items-center justify-center"
            >
              <p>Choose word</p>
              <div className="flex gap-x-2">
                {pickList.map((word, idx) => (
                  <Button key={idx} onClick={() => pickWord(idx)}>
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {!!turnPointsList.length && (
            <div
              className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
                        flex flex-col items-center justify-center"
            >
              <p>Answer:</p>
              <h3 className="text-lg font-bold">{lastTurnAnswer}</h3>
              {turnPointsList.map((player, idx) => (
                <div key={idx} className="flex gap-x-2 justify-between">
                  <p>{player.displayName}</p>
                  <p>+{player.currentPoints}</p>
                </div>
              ))}
            </div>
          )}
          <Editor
            defaultLanguage="javascript"
            onMount={handleEditorDidMount}
            onChange={handleEditorOnChange}
            value={editorValue}
            options={{
              readOnly: editorAndLangSelectorIsReadOnly,
            }}
            language={editorLanguage}
          />
        </div>
        <div className="w-72 flex flex-col justify-end bg-yellow-200">
          <div ref={chatlogRef} className="overflow-x-hidden max-h-[512px] overflow-y-auto">
            {chatArray.map((chat, idx) => (
              <p
                key={idx}
                className={`pl-2 bg-opacity-50 ${
                  chat.type === 'message-success'
                    ? 'bg-green-400'
                    : chat.type === 'message-info'
                    ? 'bg-blue-400'
                    : ''
                }`}
              >
                <span
                  className={`font-bold ${chat.type === 'message-passed' ? 'text-green-600' : ''}`}
                >
                  {chat.displayName}
                </span>{' '}
                {chat.content}
              </p>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="m-2 flex">
            <Input
              type="text"
              extraClasses="flex-grow"
              value={chatfieldInput}
              onChange={(e) => setChatfieldInput(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Room
