import { createFileRoute } from '@tanstack/react-router'
import { UserDetailPage } from '@/features/user-management/user-information/components/user-detail-page'

export const Route = createFileRoute(
  '/_authenticated/(user-management)/user-information/$id'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <UserDetailPage userId={id} />
}
