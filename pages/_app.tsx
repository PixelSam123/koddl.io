import type { AppProps } from 'next/app'

import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-yellow-100">
      <Component {...pageProps} />
    </div>
  )
}
export default appWithTranslation(MyApp)
