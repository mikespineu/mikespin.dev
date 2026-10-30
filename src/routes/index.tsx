import { useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { MsLogoRefraction } from '@/components/MsLogoRefraction'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Michał Kręcisz — Product Engineer / Software Engineer' }],
  }),
  component: Home,
})

const experiments = [
  { to: '/exp/animated-gradient', label: 'Animated gradient' },
  { to: '/exp/animated-texture', label: 'Animated texture' },
  { to: '/exp/planes', label: 'Planes' },
  { to: '/exp/reaction-diffusion', label: 'Reaction–diffusion' },
] as const

const linkClassName =
  'hover-sweep bg-neutral-950/90 px-2 py-0.5 text-white/80 hover:text-neutral-950 focus-visible:text-neutral-950'

const focusClassName =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]'

function Home() {
  const anchorRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 bg-[#f8ca00]" />
      <MsLogoRefraction
        className="fixed top-0 left-0 opacity-0 transition-opacity duration-1000 motion-reduce:transition-none"
        anchorRef={anchorRef}
      />
      {/* The body never scrolls, so short viewports scroll this layer instead. */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-svh flex-col px-[clamp(24px,6.6vw,96px)] py-[clamp(24px,3vw,40px)] text-[#141414]">
          <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <Link
              to="/"
              className={`hover-underline font-title text-[13px] font-medium ${focusClassName}`}
            >
              mikespin.dev
            </Link>
            <p className="font-title flex items-center gap-2 text-[13px] font-medium tracking-[0.08em]">
              <span aria-hidden="true" className="size-2 bg-[#141414]" />
              UNDER CONSTRUCTION
            </p>
          </header>

          <main className="flex flex-1 flex-wrap-reverse items-center justify-between gap-x-[clamp(32px,4.4vw,64px)] gap-y-12 py-12">
            <div className="flex min-w-0 flex-[1_1_480px] flex-col items-start gap-6">
              <p className="font-title text-[13px] font-medium tracking-[0.08em] uppercase">
                Product Engineer / Software Engineer
              </p>
              <h1 className="font-title text-[clamp(56px,7.2vw,104px)] leading-[.95] font-medium tracking-[-0.05em]">
                Michał
                <br />
                Kręcisz
              </h1>
              <p className="font-title text-[clamp(17px,1.5vw,22px)]">
                aka Mikespin
              </p>
              <p className="font-body max-w-[440px] text-[clamp(16px,1.25vw,18px)] leading-[1.6]">
                My portfolio is being rebuilt. In the meantime, <br/> here is my CV.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="/cv.pdf"
                  download
                  className={`hover-sweep group font-title flex h-12 items-center gap-3 bg-black px-[22px] text-white hover:text-black focus-visible:text-black ${focusClassName}`}
                >
                  Download CV
                  <svg
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M8 1v10M3.5 6.5 8 11l4.5-4.5M1 14.5h14" />
                  </svg>
                </a>
                <a
                  className={`hover-sweep font-title flex size-12 items-center justify-center bg-black text-white hover:text-black focus-visible:text-black ${focusClassName}`}
                  href="mailto:michalkrecisz@yahoo.com"
                  aria-label="Email"
                >
                  @
                </a>
              </div>
            </div>
            <div
              ref={anchorRef}
              data-logo-anchor
              role="img"
              aria-label="Mikespin logo"
              className="aspect-square w-[clamp(152px,24vw,360px)] mr-[clamp(0px,2.8vw,40px)]"
            />
          </main>

          <footer>
            <div className="flex flex-col items-start gap-2">
              <h2
                id="lab-heading"
                className="font-title text-[13px] font-medium tracking-[0.08em] uppercase"
              >
                Lab / WebGL experiments
              </h2>
              <nav
                aria-labelledby="lab-heading"
                className="flex flex-col items-start gap-1"
              >
                {experiments.map(({ to, label }) => (
                  <Link key={to} to={to} className={linkClassName}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
