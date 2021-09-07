import type { NextPage } from 'next'
import type { FormEventHandler } from 'react'

import Head from 'next/head'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
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

const Room: NextPage = () => {
  const router = useRouter()

  const [time, setTime] = useState(65)
  const [round, setRound] = useState(1)
  const [maxRound, setMaxRound] = useState(3)

  const [hiddenWord, setHiddenWord] = useState('________')

  const [playersArray, setPlayersArray] = useState<PlayerInfo[]>([
    {
      displayName: 'Sami',
      points: 39,
      position: 1,
      isInTurn: false,
    },
    {
      displayName: 'Yu',
      points: 38,
      position: 2,
      isInTurn: true,
    },
    {
      displayName: 'Are',
      points: 37,
      position: 3,
      isInTurn: false,
    },
    {
      displayName: 'Breking',
      points: 36,
      position: 4,
      isInTurn: false,
    },
    {
      displayName: 'De',
      points: 35,
      position: 5,
      isInTurn: false,
    },
    {
      displayName: 'Car',
      points: 34,
      position: 6,
      isInTurn: false,
    },
  ])
  const [chatArray, setChatArray] = useState<ChatInfo[]>([
    {
      type: 'message-info',
      displayName: 'Car',
      content: 'tersambung!',
    },
    {
      type: 'message',
      displayName: 'Car',
      content: 'halo',
    },
    {
      type: 'message-success',
      displayName: 'Sami',
      content: 'berhasil menjawab!',
    },
    {
      type: 'message-passed',
      displayName: 'Sami',
      content: 'LMAO TRY ANSEWRING',
    },
  ])

  const [chatfieldInput, setChatfieldInput] = useState('')
  const handleChatSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (chatfieldInput) {
      console.log(chatfieldInput)
      setChatfieldInput('')
    }
  }

  useEffect(() => {
    const { room } = router.query
    console.log(room) // HEY THERE, CONSOLE LOG HERE
    if (room !== undefined) {
      const socket = io({
        query: {
          room: room[0],
          name: 'Test Name',
        },
      })

      socket.on('server-send-code', (codeEditorValue) => {
        console.log(codeEditorValue)
      })

      socket.on('server-send-message', (incomingChatMessage: ChatInfo) => {
        setChatArray((prevChatArray) => [...prevChatArray, incomingChatMessage])
      })

      socket.on('server-send-timer-tick', (timerNumber: number, hiddenWord: string) => {
        setTime(timerNumber)
        setHiddenWord(hiddenWord)
      })

      socket.on('server-send-roundcount', ([currentRound, maxRoundCount]: number[]) => {
        setRound(currentRound)
        setMaxRound(maxRoundCount)
      })

      socket.on('server-send-playerlist', (playerList: PlayerInfo[]) => {
        setPlayersArray(playerList)
      })
    }
  }, [router.query])

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
          <p className="w-max text-lg tracking-widest">{hiddenWord}</p>
          <div className="w-max mr-2">Language Chooser/Your Word</div>
        </div>
        <div className="bg-yellow-200 w-max pr-2.5">
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
        <div className="min-w-0 min-h-0">
          <Editor defaultLanguage="javascript" />
        </div>
        <div className="flex flex-col justify-end bg-yellow-200">
          <div className="overflow-y-auto">
            {chatArray.map((chat, idx) => (
              <p
                key={idx}
                className={`bg-opacity-50 ${
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
