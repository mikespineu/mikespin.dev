import type { NextPage } from 'next'
import Head from 'next/head'
import { AsciiCanvas } from '@/components/AsciiCanvas'

const AsciiPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ascii Renderer</title>
      </Head>
      <div className="m-0 p-0 bg-neutral-900 w-full h-screen flex justify-center items-center">
        <main>
          <AsciiCanvas />
        </main>
      </div>
    </>
  )
}

export default AsciiPage
