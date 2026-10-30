import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exp/reveal')({ component: Page })

function Page() {
  return <div>stub</div>
}
