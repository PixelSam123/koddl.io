import type { GetStaticProps, NextPage } from 'next'
import type { FormEventHandler, MouseEventHandler } from 'react'

import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'

import Input from '../react/components/Input'
import Button from '../react/components/Button'
import SocketContext from '../react/context/SocketContext'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const socket = useContext(SocketContext)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!chosenGamemodeIsPublic) {
      if (createRoomName) {
        socket.emit('client-send-create-room-request', {
          createRoomId: createRoomName,
          turnDuration: createRoomTurnDuration,
          roundCount: createRoomRoundCount,
          pickListCount: createRoomWordChoiceCount,
        })
        router.push(`/play/${createRoomName}?name=${displayName}`)
      } else {
        router.push(`/play/${roomName}?name=${displayName}`)
      }
    }
  }

  const [chosenGamemodeIsPublic, setChosenGamemodeIsPublic] = useState(false)
  const toggleChosenGamemode = () => {
    setChosenGamemodeIsPublic((prevChosenGamemodeIsPublic) => !prevChosenGamemodeIsPublic)
  }

  const [displayName, setDisplayName] = useState('')
  const [roomName, setRoomName] = useState('')

  const [createRoomName, setCreateRoomName] = useState('')
  const [createRoomPassword, setCreateRoomPassword] = useState('')
  const [createRoomMaxPlayers, setCreateRoomMaxPlayers] = useState(10)
  const [createRoomTurnDuration, setCreateRoomTurnDuration] = useState(65)
  const [createRoomRoundCount, setCreateRoomRoundCount] = useState(3)
  const [createRoomWordChoiceCount, setCreateRoomWordChoiceCount] = useState(3)

  const handleTakeTheTutorialButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    router.push('/tutorial')
  }

  return (
    <>
      <Head>
        <title>koddl.io</title>
      </Head>
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="font-mono text-6xl font-bold">koddl.io</h1>
        <Button onClick={handleTakeTheTutorialButtonClick} extraClasses="mb-2">
          Take the Tutorial
        </Button>
        <form onSubmit={handleSubmit} className="p-2 border-2 border-gray-600 flex gap-x-2">
          <div className="flex flex-col">
            <label htmlFor="display-name">{t('display_name')}</label>
            <Input
              type="text"
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
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
              {chosenGamemodeIsPublic ? t('join_public_game') : t('join_private_game')}
            </Button>
          </div>
          {!chosenGamemodeIsPublic && (
            <div className="flex flex-col items-center">
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
                {/*<label htmlFor="password">Password</label>*/}
                {/*<Input*/}
                {/*  type="password"*/}
                {/*  id="password"*/}
                {/*  placeholder={t('leave_blank_for_no_password')}*/}
                {/*  value={createRoomPassword}*/}
                {/*  onChange={(e) => setCreateRoomPassword(e.target.value)}*/}
                {/*/>*/}
                {/* <label htmlFor="max-players">{t('max_players')}</label>
                <Input
                  type="number"
                  id="max-players"
                  value={createRoomMaxPlayers}
                  onChange={(e) => setCreateRoomMaxPlayers(parseInt(e.target.value))}
                /> */}
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
              <Button type="submit" extraClasses="mt-2">
                Create & Join
              </Button>
            </div>
          )}
        </form>
        {/*<Button onClick={toggleChosenGamemode} extraClasses="mt-2">*/}
        {/*  {chosenGamemodeIsPublic ? t('switch_to_private_game') : t('switch_to_public_game')}*/}
        {/*</Button>*/}
      </div>
      <div className="mx-2">
        <h2 className="text-3xl font-bold text-center">{t('how_to_play')}</h2>
        <h3 className="text-2xl font-bold">{t('pick_a_word')}</h3>
        <p>{t('pick_a_word_description')}</p>
        <h3 className="text-2xl font-bold">{t('code_exclamation')}</h3>
        <p>{t('code_exclamation_description')}</p>
        <h3 className="text-2xl font-bold">{t('what_if_not_your_turn')}</h3>
        <p>{t('what_if_not_your_turn_description')}</p>
        <h3 className="text-2xl font-bold">Bingo!</h3>
        <p>{t('bingo_description')}</p>
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
