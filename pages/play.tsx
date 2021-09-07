import type { NextPage } from 'next'

import Head from 'next/head'
import { useEffect, useState } from 'react'

const Play: NextPage = () => {
  const [time, setTime] = useState(65)
  const [round, setRound] = useState(1)
  const [maxRound, setMaxRound] = useState(3)

  const [hiddenWord, setHiddenWord] = useState('________')

  return (
    <>
      <Head>
        <title>koddl.io - Play</title>
      </Head>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid font-mono">
        <div className="col-span-3 flex items-center gap-x-2 bg-yellow-50">
          <div className="w-max flex items-center">
            <p className="w-10 text-center text-3xl">{time}</p>
            <p>
              Round {round} of {maxRound}
            </p>
          </div>
          <p className="w-max text-lg tracking-widest">{hiddenWord}</p>
          <div className="w-max mr-2">Language Chooser/Your Word</div>
        </div>
        <div className="border-2 border-red-500">Players Sidebar</div>
        <div className="border-2 border-red-500">Code Editor</div>
        <div className="border-2 border-red-500">Chat Sidebar</div>
      </div>
    </>
  )
}

export default Play
