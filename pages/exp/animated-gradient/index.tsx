import type { NextPage } from 'next'
import Head from "next/head";
import { AnimatedGradients } from '@/components/AnimatedGradients';

const AnimatedGradientsPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>WEBgL animated Gradients</title>
            </Head>
            <div className='m-0 p-0 bg-neutral-900 w-full flex justify-center items-center'>
                <main>
                    <AnimatedGradients />
                </main>
            </div>
        </>
    )
}

export default AnimatedGradientsPage
