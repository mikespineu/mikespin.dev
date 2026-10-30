import { Suspense, lazy } from 'react'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { BackLink } from '@/components/BackLink'

// WebGPU, the camera and Leva only exist in the browser.
const ReactionDiffusion = lazy(() =>
  import('@/components/ReactionDiffusion').then((m) => ({
    default: m.ReactionDiffusion,
  }))
)

export const Route = createFileRoute('/exp/reaction-diffusion')({
  head: () => ({
    meta: [{ title: 'Reaction–diffusion portrait · WebGPU / TSL' }],
  }),
  component: ReactionDiffusionPage,
})

function ReactionDiffusionPage() {
  const fallback = <div className="h-dvh w-full bg-neutral-900" />
  return (
    <div className="m-0 p-0 bg-neutral-900 w-full">
      <BackLink />
      <main>
        <ClientOnly fallback={fallback}>
          <Suspense fallback={fallback}>
            <ReactionDiffusion />
          </Suspense>
        </ClientOnly>
      </main>
    </div>
  )
}
