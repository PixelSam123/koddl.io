import type {
  ChangeEventHandler,
  Dispatch,
  FC,
  FormEventHandler,
  LegacyRef,
  SetStateAction,
} from 'react'
import type { OnChange } from '@monaco-editor/react'

import Editor from '@monaco-editor/react'

import Button from './Button'
import Input from './Input'

type EditorLanguages = 'javascript' | 'php' | 'cpp' | 'python'

interface PlayerInfo {
  displayName: string
  points: number
  position: number
  isInTurn: boolean
}
interface TurnResults {
  displayName: string
  currentPoints: number
}
interface ChatInfo {
  type: string
  displayName: string
  content: string
}

interface GameWindowProps {
  timerTime: number
  currentRound: number
  maxRound: number
  pickedWord: string
  hiddenWord: string
  editorLanguage: EditorLanguages
  editorAndLangSelectorIsReadOnly: boolean
  langSelectorOnChange: ChangeEventHandler<HTMLSelectElement>
  playerListArray: PlayerInfo[]
  isWaitingForPlayers: boolean
  wordChooserPlayer: string
  wordChoiceList: string[]
  chooseWordFunction: (idx: number) => void
  turnResultsList: TurnResults[]
  previousTurnAnswer: string
  editorOnChange: OnChange
  editorValue: string
  chatlogRef: LegacyRef<HTMLDivElement>
  chatArray: ChatInfo[]
  chatFormOnSubmit: FormEventHandler<HTMLFormElement>
  chatInputValue: string
  chatInputValueSetter: Dispatch<SetStateAction<string>>
}

const GameWindow: FC<GameWindowProps> = ({
  timerTime,
  currentRound,
  maxRound,
  pickedWord,
  hiddenWord,
  editorLanguage,
  editorAndLangSelectorIsReadOnly,
  langSelectorOnChange,
  playerListArray,
  isWaitingForPlayers,
  wordChooserPlayer,
  wordChoiceList,
  chooseWordFunction,
  turnResultsList,
  previousTurnAnswer,
  editorOnChange,
  editorValue,
  chatlogRef,
  chatArray,
  chatFormOnSubmit,
  chatInputValue,
  chatInputValueSetter,
}) => (
  <div
    className="self-center grid font-mono
      w-screen max-w-screen-xl h-[37.5rem] max-h-screen overflow-y-hidden"
  >
    <div className="col-span-3 flex items-center justify-between gap-x-2 bg-yellow-50">
      <div className="w-max flex items-center">
        <p className="w-10 text-center text-3xl">{timerTime}</p>
        <p>
          Round {currentRound} of {maxRound}
        </p>
      </div>
      <p className="w-max text-lg tracking-widest">{pickedWord || hiddenWord}</p>
      <div className="w-max">
        {pickedWord && 'Your Turn '}
        <select
          value={editorLanguage}
          disabled={editorAndLangSelectorIsReadOnly}
          onChange={langSelectorOnChange}
          className="h-9 py-0"
        >
          <option value="javascript">JavaScript</option>
          <option value="php">PHP</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>
      </div>
    </div>
    <div className="bg-yellow-200 w-44 pr-2.5 max-h-[563.5px] overflow-y-auto">
      {playerListArray.map((player, idx) => (
        <div key={idx} className="my-1 flex items-center leading-[1.125rem]">
          <p className={`w-10 flex-shrink-0 text-center ${player.isInTurn ? 'font-bold' : ''}`}>
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
      {isWaitingForPlayers && (
        <p
          className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
              flex items-center justify-center"
        >
          Waiting for players...
        </p>
      )}
      {wordChooserPlayer && (
        <p
          className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
                        flex items-center justify-center"
        >
          {wordChooserPlayer} is choosing a word...
        </p>
      )}
      {!!wordChoiceList.length && (
        <div
          className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
                        flex flex-col items-center justify-center"
        >
          <p>Choose word</p>
          <div className="flex gap-x-2">
            {wordChoiceList.map((word, idx) => (
              <Button key={idx} onClick={() => chooseWordFunction(idx)}>
                {word}
              </Button>
            ))}
          </div>
        </div>
      )}
      {!!turnResultsList.length && (
        <div
          className="absolute z-10 bg-gray-900 bg-opacity-50 w-full h-full text-white
                        flex flex-col items-center justify-center"
        >
          <p>Answer:</p>
          <h3 className="text-lg font-bold">{previousTurnAnswer}</h3>
          <div>
            {turnResultsList.map((player, idx) => (
              <div key={idx} className="flex gap-x-2 justify-between">
                <p>{player.displayName}</p>
                <p>+{player.currentPoints}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Editor
        defaultLanguage="javascript"
        onChange={editorOnChange}
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
            <span className={`font-bold ${chat.type === 'message-passed' ? 'text-green-600' : ''}`}>
              {chat.displayName}
            </span>{' '}
            {chat.content}
          </p>
        ))}
      </div>
      <form onSubmit={chatFormOnSubmit} className="m-2 flex">
        <Input
          type="text"
          extraClasses="flex-grow"
          value={chatInputValue}
          onChange={(e) => chatInputValueSetter(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  </div>
)

export type { EditorLanguages, PlayerInfo, TurnResults, ChatInfo }

export default GameWindow
