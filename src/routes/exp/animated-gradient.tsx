import { createFileRoute } from '@tanstack/react-router'
import { AnimatedGradients } from '@/components/AnimatedGradients'

export const Route = createFileRoute('/exp/animated-gradient')({
  head: () => ({ meta: [{ title: 'WEBgL animated Gradients' }] }),
  component: AnimatedGradientsPage,
})

function AnimatedGradientsPage() {
  return (
    <div className="m-0 p-0 bg-neutral-900 w-full flex justify-center items-center">
      <main>
        <AnimatedGradients />
      </main>
    </div>
  )
}
