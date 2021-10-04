import type { AppProps } from 'next/app'

import { appWithTranslation } from 'next-i18next'
import '../react/styles/globals.css'

import SocketContext, { socket } from '../react/context/SocketContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContext.Provider value={socket}>
      <div className="bg-blue-800 min-h-screen flex flex-col justify-center">
        <Component {...pageProps} />
      </div>
    </SocketContext.Provider>
  )
}
export default appWithTranslation(MyApp)
