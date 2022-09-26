import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className='m-0 p-0 bg-neutral-900 min-h-screen w-full flex justify-center items-center'>
      <Head>
        <title>mikespin.dev</title>
        <meta name="description" content="mikespin.dev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='text-center'>
        <Image src="/ms-logo.svg" alt="Vercel Logo" width={150} height={150} />
        <h1 className='text-xl text-slate-100'>mikespin.dev</h1>
      </main>
    </div>
  )
}

export default Home
