import { createFileRoute } from '@tanstack/react-router'
import { Planes } from '@/components/Planes'

export const Route = createFileRoute('/exp/planes')({
  head: () => ({ meta: [{ title: 'webGL abstract geometry animation' }] }),
  component: PlanesPage,
})

function PlanesPage() {
  return (
    <div className='m-0 p-0 bg-neutral-900 w-full flex justify-center items-center'>
      <main>
        <Planes />
      </main>
    </div>
  )
}
