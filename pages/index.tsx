import type { GetStaticProps, NextPage } from 'next'

import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Home: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>koddl.io</title>
      </Head>
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">koddl.io</h1>
        <form className="p-2 border-2 border-gray-600 flex gap-x-2">
          <div className="flex flex-col">
            <p>{t('display_name')}</p>

          </div>
        </form>
      </div>
      <div className="text-3xl font-bold">{t('display_name')}</div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default Home
