import { useEffect, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { MsLogoRefraction } from '@/components/MsLogoRefraction'

const siteUrl = 'https://mikespin.dev'
const siteTitle = 'Michał Kręcisz — Product Engineer / Software Engineer'
const siteDescription =
  'Michał Kręcisz, aka Mikespin, is a product and software engineer. Portfolio in progress: download the CV or explore the WebGL lab.'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: siteTitle },
      { name: 'description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: siteDescription },
      { property: 'og:url', content: siteUrl },
      { property: 'og:image', content: `${siteUrl}/og-image.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: siteUrl }],
  }),
  component: Home,
})

const experiments = [
  { to: '/exp/animated-gradient', label: 'Animated gradient' },
  { to: '/exp/animated-texture', label: 'Animated texture' },
  { to: '/exp/planes', label: 'Planes' },
  { to: '/exp/reaction-diffusion', label: 'Reaction–diffusion' },
  { to: '/exp/grain-mirror', label: 'Grain mirror' },
] as const

const linkClassName =
  'hover-sweep bg-neutral-950/90 px-2 py-0.5 text-white/80 hover:text-neutral-950 focus-visible:text-neutral-950'

const focusClassName =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]'

const iconButtonClassName = `hover-sweep font-title flex items-center justify-center bg-neutral-950/90 text-white/80 hover:text-neutral-950 focus-visible:text-neutral-950 ${focusClassName}`

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

const projects = [
  {
    name: 'keepAwake',
    href: 'https://github.com/mikespineu/keepAwake',
    description:
      'macOS menu bar app that keeps your Mac awake, with a timer and a low-battery cutoff.',
    stack: 'Swift',
    video: { src: '/video/keep-awake.mp4', poster: '/video/keep-awake.jpg' },
  },
  {
    name: 'poster-wall-controls',
    href: 'https://github.com/mikespineu/poster-wall-controls',
    description:
      'Custom React Three Fiber controls for a 3D poster wall: pan, zoom, focus and rotate.',
    stack: 'TypeScript',
    image: '/video/poster-wall-controls.gif',
  },
  {
    name: 'design-system-wireframe',
    href: 'https://github.com/mikespineu/design-system-wireframe',
    description:
      'Minimal React design system on Radix UI, built by a Claude Code agent pipeline.',
    stack: 'TypeScript',
  },
  {
    name: 'tanstack-start-r3f-template',
    href: 'https://github.com/mikespineu/tanstack-start-r3f-template',
    description:
      'TanStack Start and React Three Fiber starter with SSR, drei and Tailwind 4.',
    stack: 'TypeScript',
  },
]

// Started here because React omits `muted` from server HTML, which blocks autoplay.
// Waits for the card to appear so the hero doesn't download the video.
function playMutedWhenVisible(video: HTMLVideoElement) {
  video.muted = true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video.play().catch(() => {})
    else video.pause()
  })
  observer.observe(video)
  return () => observer.disconnect()
}

function ContactLinks({ className }: { className: string }) {
  return (
    <>
      <a
        className={`${iconButtonClassName} ${className}`}
        href="mailto:michalkrecisz@yahoo.com"
        aria-label="Email"
      >
        @
      </a>
      {profiles.map(({ href, label, icon }) => (
        <a
          key={href}
          className={`${iconButtonClassName} ${className}`}
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
    </>
  )
}

function Home() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // A hero taller than the viewport must scroll to its end before it pins.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    function updateStickyOffset() {
      if (!hero) return
      const overflow = hero.offsetHeight - window.innerHeight
      hero.style.top = `${Math.min(0, -overflow)}px`
    }

    const observer = new ResizeObserver(updateStickyOffset)
    observer.observe(hero)
    window.addEventListener('resize', updateStickyOffset)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateStickyOffset)
    }
  }, [])

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 bg-[#f8ca00]" />
      <MsLogoRefraction
        className="fixed top-0 left-0 opacity-0 transition-opacity duration-1000 motion-reduce:transition-none"
        anchorRef={anchorRef}
      />
      {/* The body never scrolls, so short viewports scroll this layer instead. */}
      <div className="fixed inset-0 snap-y snap-proximity overflow-y-auto">
        {/* Ends above the strip, so the pinned hero can't show through it. */}
        <div className="relative">
        {/* The marker carries the snap point, as a pinned hero would match at every offset. */}
        <div aria-hidden="true" className="absolute top-0 h-px w-px snap-start" />
        <div
          ref={heroRef}
          className="sticky top-0 flex min-h-svh flex-col px-[clamp(24px,6.6vw,96px)] py-[clamp(24px,3vw,40px)] text-[#141414]"
        >
          <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <Link
              to="/"
              className={`hover-underline font-title text-[13px] font-medium ${focusClassName}`}
            >
              mikespin.dev
            </Link>
            <p className="font-title flex items-center gap-2 text-[13px] font-medium tracking-[0.08em]">
              UNDER CONSTRUCTION
              <span
                aria-hidden="true"
                className="dos-cursor h-[1.1em] w-[0.65em] bg-[#141414]"
              />
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
                <ContactLinks className="size-12" />
              </div>
            </div>
            <div
              ref={anchorRef}
              data-logo-anchor
              role="img"
              aria-label="Mikespin logo"
              className="aspect-square cursor-pointer w-[clamp(152px,24vw,360px)] xl:w-[clamp(228px,36vw,540px)] mr-[clamp(0px,2.8vw,40px)]"
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

        <section className="relative flex snap-start min-h-[calc(100vh-120px)] flex-col lg:min-h-[calc(100vh-180px)] justify-center gap-[clamp(32px,4vw,56px)] bg-white py-[clamp(48px,6vw,80px)] text-[#141414]">
          <h2 className="font-title px-[clamp(24px,6.6vw,96px)] text-[clamp(40px,5vw,72px)] leading-[.95] font-medium tracking-[-0.05em]">
            Built in the Open
          </h2>
          <ul className="no-scrollbar flex snap-x snap-mandatory scroll-px-[clamp(24px,6.6vw,96px)] gap-4 overflow-x-auto px-[clamp(24px,6.6vw,96px)] lg:grid lg:grid-cols-4 lg:overflow-visible">
            {projects.map(({ name, href, description, stack, video, image }) => (
              <li
                key={name}
                className="w-[78%] shrink-0 snap-start sm:w-[42%] lg:w-auto"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex flex-col gap-3 ${focusClassName}`}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-950">
                    {video ? (
                      <video
                        ref={playMutedWhenVisible}
                        aria-hidden="true"
                        className="size-full object-cover"
                        poster={video.poster}
                        src={video.src}
                        preload="none"
                        loop
                        muted
                        playsInline
                      />
                    ) : image ? (
                      <img
                        alt=""
                        className="size-full object-cover"
                        loading="lazy"
                        src={image}
                      />
                    ) : (
                      <div className="font-title flex size-full items-end p-4 text-[clamp(20px,2vw,28px)] leading-[1.05] font-medium tracking-[-0.03em] break-words text-white/80">
                        {name}
                      </div>
                    )}
                  </div>
                  <h3 className="font-title text-[15px] font-medium break-words group-hover:underline">
                    {name}
                  </h3>
                  <p className="font-body text-[15px] leading-[1.5]">
                    {description}
                  </p>
                  <p className="font-title text-[13px] tracking-[0.08em] uppercase">
                    {stack}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
        </div>

        {/* Transparent, so the WebGL gradient behind the page shows through. */}
        <div className="flex h-[120px] snap-end items-center justify-between lg:h-[180px] px-[clamp(24px,6.6vw,96px)] text-[#141414]">
          <Link
            to="/"
            className={`hover-underline font-title text-[13px] font-medium ${focusClassName}`}
          >
            mikespin.dev
          </Link>
          <div className="flex items-center gap-1">
            <ContactLinks className="size-12" />
          </div>
        </div>
      </div>
    </>
  )
}
