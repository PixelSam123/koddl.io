import type { NextPage } from 'next'

import Head from 'next/head'

const Play: NextPage = () => {
  return (
    <>
      <Head>
        <title>koddl.io - Play</title>
      </Head>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="grid grid-cols-3">
          <div className="border-2 border-red-500">Counter, Round</div>
          <div className="border-2 border-red-500">Hidden Word</div>
          <div className="border-2 border-red-500">Language Chooser/Your Word</div>
          <div className="border-2 border-red-500">Players Sidebar</div>
          <div className="border-2 border-red-500">Code Editor</div>
          <div className="border-2 border-red-500">Chat Sidebar</div>
        </div>
      </div>
    </>
  )
}

export default Play
