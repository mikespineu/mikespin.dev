import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exp/react-three-fiber')({ component: Page })

function Page() {
  return <div>stub</div>
}
