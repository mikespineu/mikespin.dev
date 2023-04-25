import type { NextPage } from 'next'
import Head from "next/head";
import { Planes } from '@/components/Planes';

const AnimatedGradientsPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>webGL abstract geometry animation</title>
            </Head>
            <div className='m-0 p-0 bg-neutral-900 w-full flex justify-center items-center'>
                <main>
                    <Planes />
                </main>
            </div>
        </>
    )
}

export default AnimatedGradientsPage
