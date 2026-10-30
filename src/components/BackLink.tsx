import { Link } from '@tanstack/react-router'

export function BackLink() {
  return (
    <Link
      to="/"
      className="fixed top-4 left-4 md:top-7 md:left-16 z-50 text-white opacity-40 hover:opacity-100"
    >
      &lt; back
    </Link>
  )
}
