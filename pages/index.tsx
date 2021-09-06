import type { GetStaticProps, NextPage } from 'next'
import type { FormEventHandler } from 'react'

import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'

import Input from '../components/Input'
import Button from '../components/Button'

const Home: NextPage = () => {
  const { t } = useTranslation('common')

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log('submit test')
  }

  const [chosenGamemodeIsPublic, setChosenGamemodeIsPublic] = useState(true)
  const toggleChosenGamemode = () => {
    setChosenGamemodeIsPublic((prevChosenGamemodeIsPublic) => !prevChosenGamemodeIsPublic)
  }

  const [displayName, setDisplayName] = useState('')
  const [roomName, setRoomName] = useState('')

  const [createRoomName, setCreateRoomName] = useState('')
  const [createRoomPassword, setCreateRoomPassword] = useState('')
  const [createRoomMaxPlayers, setCreateRoomMaxPlayers] = useState(10)
  const [createRoomTurnDuration, setCreateRoomTurnDuration] = useState(60)
  const [createRoomRoundCount, setCreateRoomRoundCount] = useState(3)
  const [createRoomWordChoiceCount, setCreateRoomWordChoiceCount] = useState(3)

  return (
    <>
      <Head>
        <title>koddl.io</title>
      </Head>
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">koddl.io</h1>
        <form onSubmit={handleSubmit} className="p-2 border-2 border-gray-600 flex gap-x-2">
          <div className="flex flex-col">
            <label htmlFor="display-name">{t('display_name')}</label>
            <Input
              type="text"
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {!chosenGamemodeIsPublic && (
              <>
                <label htmlFor="room-name">{t('room_name')}</label>
                <Input
                  type="text"
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </>
            )}
            <Button type="submit" extraClasses="mt-2 self-center">
              Join {chosenGamemodeIsPublic ? 'Public' : 'Private'} Game
            </Button>
          </div>
          {!chosenGamemodeIsPublic && (
            <div>
              <fieldset className="border border-gray-400 px-2 pb-2 flex flex-col">
                <legend className="font-bold px-1 self-start text-center">
                  Create Private Game
                </legend>
                <label htmlFor="create-room-name">{t('room_name')}</label>
                <Input
                  type="text"
                  id="create-room-name"
                  value={createRoomName}
                  onChange={(e) => setCreateRoomName(e.target.value)}
                />
                <h3 className="font-bold mt-1">Options</h3>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Leave blank for no password"
                  value={createRoomPassword}
                  onChange={(e) => setCreateRoomPassword(e.target.value)}
                />
                <label htmlFor="max-players">{t('max_players')}</label>
                <Input
                  type="number"
                  id="max-players"
                  value={createRoomMaxPlayers}
                  onChange={(e) => setCreateRoomMaxPlayers(parseInt(e.target.value))}
                />
                <label htmlFor="turn-duration">{t('turn_duration')}</label>
                <Input
                  type="number"
                  id="turn-duration"
                  value={createRoomTurnDuration}
                  onChange={(e) => setCreateRoomTurnDuration(parseInt(e.target.value))}
                />
                <label htmlFor="round-count">{t('round_count')}</label>
                <Input
                  type="number"
                  id="round-count"
                  value={createRoomRoundCount}
                  onChange={(e) => setCreateRoomRoundCount(parseInt(e.target.value))}
                />
                <label htmlFor="word-choice-count">{t('word_choice_count')}</label>
                <Input
                  type="number"
                  id="word-choice-count"
                  value={createRoomWordChoiceCount}
                  onChange={(e) => setCreateRoomWordChoiceCount(parseInt(e.target.value))}
                />
              </fieldset>
            </div>
          )}
        </form>
        <Button onClick={toggleChosenGamemode} extraClasses="mt-2">
          Switch to {!chosenGamemodeIsPublic ? 'Public' : 'Private'} Game
        </Button>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default Home
