import type { AppProps } from 'next/app'

import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'

import SocketContext, { socket } from '../context/SocketContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContext.Provider value={socket}>
      <div className="bg-slate-900 text-slate-100 min-h-screen">
        <Component {...pageProps} />
      </div>
    </SocketContext.Provider>
  )
}
export default appWithTranslation(MyApp)
