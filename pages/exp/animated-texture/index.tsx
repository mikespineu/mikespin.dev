import type { NextPage } from 'next'
import Head from "next/head";
import { AnimatedTexture } from '@/components/AnimatedTexture';

const AnimatedTexturesPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>WEBgL animated Textures</title>
            </Head>
            <div className='m-0 p-0 bg-neutral-900 min-h-screen w-full flex justify-center items-center'>
                <main className='text-center'>
                    <AnimatedTexture />
                </main>
            </div>
        </>
    )
}

export default AnimatedTexturesPage
