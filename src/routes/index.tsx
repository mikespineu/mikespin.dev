import { Link, createFileRoute } from '@tanstack/react-router'
import { MsLogoRefraction } from '@/components/MsLogoRefraction'

export const Route = createFileRoute('/')({ component: Home })

const experiments = [
  { to: '/exp/animated-gradient', label: 'Animated gradient' },
  { to: '/exp/animated-texture', label: 'Animated texture' },
  { to: '/exp/planes', label: 'Planes' },
] as const

function Home() {
  return (
    <div className="m-0 p-0 h-dvh w-full flex justify-center items-center relative">
      <MsLogoRefraction className="fixed top-0 left-0" />
      <nav className="absolute bottom-3 md:bottom-7 left-4 md:left-16 flex flex-col gap-1 text-white">
        {experiments.map(({ to, label }) => (
          <Link key={to} to={to} className="opacity-40 hover:opacity-100">
            {label}
          </Link>
        ))}
      </nav>
      <a
        className="absolute bottom-1 text-white md:bottom-5 right-4 md:right-16 text-7xl opacity-40"
        href="mailto:michalkrecisz@yahoo.com"
      >
        @
      </a>
    </div>
  )
}
