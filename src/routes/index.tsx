import { Link, createFileRoute } from '@tanstack/react-router'
import { MsLogoRefraction } from '@/components/MsLogoRefraction'

export const Route = createFileRoute('/')({ component: Home })

const experiments = [
  { to: '/exp/animated-gradient', label: 'Animated gradient' },
  { to: '/exp/animated-texture', label: 'Animated texture' },
  { to: '/exp/planes', label: 'Planes' },
  { to: '/exp/reaction-diffusion', label: 'Reaction–diffusion' },
] as const

const linkClassName =
  'bg-neutral-950/90 px-2 py-0.5 text-white/80 transition-colors hover:text-white'

function Home() {
  return (
    <div className="m-0 p-0 h-dvh w-full flex justify-center items-center relative">
      <MsLogoRefraction className="fixed top-0 left-0" />
      <nav className="absolute bottom-3 md:bottom-7 left-4 md:left-16 flex flex-col items-start gap-1">
        {experiments.map(({ to, label }) => (
          <Link key={to} to={to} className={linkClassName}>
            {label}
          </Link>
        ))}
      </nav>
      <a
        className={`absolute bottom-3 md:bottom-7 right-4 md:right-16 ${linkClassName}`}
        href="mailto:michalkrecisz@yahoo.com"
        aria-label="Email"
      >
        @
      </a>
    </div>
  )
}
