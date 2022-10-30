import type { NextPage } from 'next'
import Head from "next/head";
// import { AsciiCanvas } from '@/components/AsciiCanvas';

const AsciiPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>ELO from camera </title>
            </Head>
            <div className='m-0 p-0 bg-neutral-900 min-h-screen w-full flex justify-center items-center'>
                <main className='text-center'>
                    {/*<AsciiCanvas />*/}
                </main>
            </div>
        </>
    )
}

export default AsciiPage
