import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { branchService, loanService } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
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

  // Fetch districts for "Шүүх дээр" (status 1)
  const { data: districtsAtCourtData } = useQuery({
    queryKey: ['sidebar-districts-at-court'],
    queryFn: async () => {
      try {
        const res = await loanService.getDistrictsWithJudgeLoans({ statusId: 1 })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch districts (status 1) for sidebar:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Fetch districts for "Шүүхийн шийдвэр" (status 4)
  const { data: districtsDecisionData } = useQuery({
    queryKey: ['sidebar-districts-decision'],
    queryFn: async () => {
      try {
        const res = await loanService.getDistrictsWithJudgeLoans({ statusId: 4 })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch districts (status 4) for sidebar:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Build nav groups with dynamic branches and districts
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

    // Create district items for "Шүүх дээр"
    const districtAtCourtItems =
      districtsAtCourtData && districtsAtCourtData.length > 0
        ? districtsAtCourtData.map((district) => ({
            title: `${district.districtMn.replace(' дүүрэг', '')} (${district.judgeLoanCount || 0})`,
            url: `/district/${district.id}?statusId=1`,
          }))
        : []

    // Create district items for "Шүүхийн шийдвэр"
    const districtDecisionItems =
      districtsDecisionData && districtsDecisionData.length > 0
        ? districtsDecisionData.map((district) => ({
            title: `${district.districtMn.replace(' дүүрэг', '')} (${district.judgeLoanCount || 0})`,
            url: `/district/${district.id}?statusId=4`,
          }))
        : []

    // Build new nav groups with dynamic menu injections
    return sidebarData.navGroups.map((group) => {
      if (group.title !== 'Ерөнхий') {
        return group
      }

      return {
        ...group,
        items: group.items.map((item) => {
          // Injection for Зээл menu
          if ('items' in item && item.title === 'Зээл') {
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
          }

          // Injection for Шүүх menu
          if ('items' in item && item.title === 'Шүүх') {
            const staticItems = item.items || []
            return {
              ...item,
              items: [
                {
                  title: 'Шүүх дээр',
                  items: districtAtCourtItems,
                },
                {
                  title: 'Шүүхийн шийдвэр',
                  items: districtDecisionItems,
                },
                ...staticItems,
              ],
            }
          }

          return item
        }),
      }
    }) as NavGroupType[]
  }, [branchesData, districtsAtCourtData, districtsDecisionData])

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
