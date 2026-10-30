import { createFileRoute } from '@tanstack/react-router'
import { AnimatedTexture } from '@/components/AnimatedTexture'

export const Route = createFileRoute('/exp/animated-texture')({
  head: () => ({ meta: [{ title: 'WEBgL animated Textures' }] }),
  component: AnimatedTexturesPage,
})

function AnimatedTexturesPage() {
  return (
    <div className="m-0 p-0 bg-neutral-900 w-full flex justify-center items-center">
      <main>
        <AnimatedTexture />
      </main>
    </div>
  )
}
