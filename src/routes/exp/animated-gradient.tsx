import { createFileRoute } from '@tanstack/react-router'
import { AnimatedGradients } from '@/components/AnimatedGradients'
import { BackLink } from '@/components/BackLink'

export const Route = createFileRoute('/exp/animated-gradient')({
  head: () => ({
    meta: [{ title: 'WEBgL animated Gradients' }],
    // Runs before paint so embeds never flash the prerendered text.
    scripts: [
      {
        children:
          "if(new URLSearchParams(location.search).has('embed'))document.documentElement.dataset.embed=''",
      },
    ],
  }),
  component: AnimatedGradientsPage,
})

function AnimatedGradientsPage() {
  return (
    <div className="m-0 p-0 bg-neutral-900 w-full flex justify-center items-center">
      <div className="embed-hidden">
        <BackLink />
      </div>
      <main>
        <AnimatedGradients />
      </main>
    </div>
  )
}
