import type { NextPage } from 'next';
import { MsLogoRefraction } from '@/components/MsLogoRefraction';

const Home: NextPage = () => {
  return (
    <div className='m-0 p-0 min-h-screen w-full flex justify-center items-center relative'>
        <MsLogoRefraction className="fixed top-0 left-0 p-8 md:p-16"/>
        <a className="absolute bottom-1 md:bottom-5 right-8 md:right-16" href="mailto:michalkrecisz@yahoo.com">michalkrecisz@yahoo.com</a>
    </div>
  )
}

export default Home
