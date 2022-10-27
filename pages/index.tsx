import type { NextPage } from 'next';
import Image from 'next/image';
import { MsLogoRefraction } from '@/components/MsLogoRefraction';

const Home: NextPage = () => {
  return (
    <div className='m-0 p-0 bg-neutral-900 min-h-screen w-full flex justify-center items-center'>
        <MsLogoRefraction className="fixed top-0 left-0"/>
        <main className='text-center relative'>
            {/*<h1 className='text-2xl text-slate-900 mix-blend-difference text-gray-600'>MIKESPIN.DEV</h1>*/}
        </main>
    </div>
  )
}

export default Home
