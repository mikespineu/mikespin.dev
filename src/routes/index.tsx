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

const iconButtonClassName = `hover-sweep font-title flex size-12 items-center justify-center bg-neutral-950/90 text-white/80 hover:text-neutral-950 focus-visible:text-neutral-950 ${focusClassName}`

const profiles = [
  {
    href: 'https://github.com/mikespineu',
    label: 'GitHub',
    icon: 'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3',
  },
  {
    href: 'https://linkedin.com/in/michal-krecisz',
    label: 'LinkedIn',
    icon: 'M20.4 20.5h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.4 4.2 5.5zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1M7.1 20.5H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0',
  },
]

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
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/cv.pdf"
                  download
                  className={`hover-sweep hover-sweep-ink group font-title flex h-12 items-center gap-3 bg-white px-[22px] text-black hover:text-white focus-visible:text-white ${focusClassName}`}
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
                  className={iconButtonClassName}
                  href="mailto:michalkrecisz@yahoo.com"
                  aria-label="Email"
                >
                  @
                </a>
                {profiles.map(({ href, label, icon }) => (
                  <a
                    key={href}
                    className={iconButtonClassName}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div
              ref={anchorRef}
              data-logo-anchor
              role="img"
              aria-label="Mikespin logo"
              className="aspect-square w-[clamp(152px,24vw,360px)] xl:w-[clamp(228px,36vw,540px)] mr-[clamp(0px,2.8vw,40px)]"
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
                className="flex flex-wrap gap-1 md:flex-col md:items-start"
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
