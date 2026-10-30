import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exp/planes')({ component: Page })

function Page() {
  return <div>stub</div>
}
