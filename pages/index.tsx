import type { NextPage } from 'next'
import { MsLogoRefraction } from '@/components/MsLogoRefraction'

const Home: NextPage = () => {
  return (
    <div className="m-0 p-0 h-dvh w-full flex justify-center items-center relative">
      <MsLogoRefraction className="fixed top-0 left-0" />
      <a
        className="absolute bottom-1 text-white md:bottom-5 right-4 md:right-16 text-7xl opacity-40"
        href="mailto:michalkrecisz@yahoo.com"
      >
        @
      </a>
    </div>
  )
}

export default Home
