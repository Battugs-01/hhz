import { useQuery } from '@tanstack/react-query'
import { Outlet } from '@tanstack/react-router'
import { authService } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { DrawerProvider } from '@/context/drawer-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ConfigDrawer } from '@/components/config-drawer'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SkipToMain } from '@/components/skip-to-main'
import { ThemeSwitch } from '@/components/theme-switch'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const { setUser, token } = useAuthStore()
  useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      const info = await authService.getUserInfo()
      if (info.success && info.data) {
        setUser(info.data)
      }
      return info
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  return (
    <SearchProvider>
      <LayoutProvider>
        <DrawerProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar />
            <SidebarInset
              className={cn(
                '@container/content',

                'has-[[data-layout=fixed]]:h-svh',

                'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
              )}
            >
              <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                  <ThemeSwitch />
                  <ConfigDrawer />
                  <ProfileDropdown />
                </div>
              </Header>
              {children ?? <Outlet />}
            </SidebarInset>
          </SidebarProvider>
        </DrawerProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
