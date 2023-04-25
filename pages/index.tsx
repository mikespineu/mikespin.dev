import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { MsLogoRefraction } from '@/components/MsLogoRefraction'

interface Person {
  name: string
}

const Home: NextPage = () => {
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setLoading] = useState(false)

  const getPeople = async () => {
    setLoading(true)

    const response = await fetch('https://swapi.dev/api/people')
    const data = await response.json()

    setPeople(data.results)
    setLoading(false)
  }

  useEffect(() => {
    getPeople()
    return () => {
      getPeople()
    }
  }, [])
  if (isLoading) return <p>Loading...</p>
  if (!people) return <p>No profile data</p>
  return (
    <div className="m-0 p-0 min-h-screen w-full flex justify-center items-center relative">
      <MsLogoRefraction className="fixed top-0 left-0 p-8 md:p-16" />
      <a
        className="absolute bottom-1 md:bottom-5 right-8 md:right-16"
        href="mailto:michalkrecisz@yahoo.com"
      >
        michalkrecisz@yahoo.com
        {people &&
          people.map((person, index) => <div key={index}>{person.name}</div>)}
      </a>
    </div>
  )
}

export default Home
