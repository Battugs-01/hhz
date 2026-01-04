import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { branchService } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import type { NavGroup as NavGroupType } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuthStore()

  // Fetch branches for dynamic menu
  const { data: branchesData } = useQuery({
    queryKey: ['sidebar-branches'],
    queryFn: async () => {
      try {
        const res = await branchService.listBranches({
          current: 1,
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch branches for sidebar:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Build nav groups with dynamic branches
  const navGroups = useMemo(() => {
    // Create branch items for loans
    const branchLoanItems =
      branchesData && branchesData.length > 0
        ? branchesData
            .filter((branch) => branch.isActive)
            .map((branch) => ({
              title: branch.branch,
              url: `/branches/${branch.id}`,
            }))
        : []

    // Build new nav groups with branches injected into Зээл menu
    return sidebarData.navGroups.map((group) => {
      if (group.title !== 'Ерөнхий') {
        return group
      }

      return {
        ...group,
        items: group.items.map((item) => {
          // Only modify Зээл menu
          if (!('items' in item) || item.title !== 'Зээл') {
            return item
          }

          // Inject branches into Зээл submenu
          const staticItems = item.items || []
          return {
            ...item,
            items: [
              staticItems[0], // Бүх зээлүүд
              ...branchLoanItems,
              staticItems[1], // Зээл оруулах
              staticItems[2], // Зээл статус
            ],
          }
        }),
      }
    }) as NavGroupType[]
  }, [branchesData])

  const userData = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: '/avatars/shadcn.jpg',
      }
    : {
        name: 'Guest',
        email: 'guest@example.com',
        avatar: '/avatars/shadcn.jpg',
      }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
