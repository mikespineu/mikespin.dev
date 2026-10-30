import { Suspense, lazy } from 'react'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { BackLink } from '@/components/BackLink'

// WebGL, the camera and Leva only exist in the browser.
const GrainMirror = lazy(() =>
  import('@/components/GrainMirror').then((m) => ({
    default: m.GrainMirror,
  }))
)

export const Route = createFileRoute('/exp/grain-mirror')({
  head: () => ({
    meta: [{ title: 'Grain mirror · WebGL' }],
  }),
  component: GrainMirrorPage,
})

function GrainMirrorPage() {
  const fallback = <div className="h-dvh w-full bg-neutral-900" />
  return (
    <div className="m-0 p-0 bg-neutral-900 w-full">
      <BackLink />
      <main>
        <ClientOnly fallback={fallback}>
          <Suspense fallback={fallback}>
            <GrainMirror />
          </Suspense>
        </ClientOnly>
      </main>
    </div>
  )
}
