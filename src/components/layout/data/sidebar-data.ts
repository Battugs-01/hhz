import {
  Bell,
  Bug,
  Coins,
  Construction,
  FileText,
  FileX,
  HelpCircle,
  Landmark,
  LayoutDashboard,
  Lock,
  Monitor,
  Palette,
  ServerOff,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCog,
  UserX,
  Users,
  Wrench,
} from 'lucide-react'
import { LogoImage } from '../logo-image'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Xmeta Admin Dashboard',
      logo: LogoImage,
      plan: 'Xmeta Admin Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: ListTodo,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: Package,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: MessagesSquare,
        // },
        {
          title: 'User Management',
          icon: Users,
          items: [
            {
              title: 'User Information',
              url: '/user-information',
              icon: UserCog,
            },
          ],
        },
        {
          title: 'Bank',
          icon: Landmark,
          items: [
            {
              title: 'Deposit',
              url: '/bank/deposit',
              icon: Landmark,
            },
            {
              title: 'Withdrawal',
              url: '/bank/withdrawal',
              icon: Landmark,
            },
            {
              title: 'Bank Accounts',
              url: '/bank/wallets',
              icon: Landmark,
            },
            {
              title: 'Exchange Txn',
              url: '/bank/exchange-txn',
              icon: Landmark,
            },
          ],
        },
        {
          title: 'Crypto',
          icon: Coins,
          items: [
            {
              title: 'Deposit',
              url: '/crypto/deposit',
              icon: Coins,
            },
            {
              title: 'Withdrawal',
              url: '/crypto/withdrawal',
              icon: Coins,
            },
            {
              title: 'Coins',
              url: '/crypto/coins',
              icon: Coins,
            },
            {
              title: 'Wallet Address',
              url: '/crypto/wallet-address',
              icon: Coins,
            },
          ],
        },
        {
          title: 'Stake',
          icon: TrendingUp,
          items: [
            {
              title: 'Asset',
              url: '/stake/asset',
              icon: Coins,
            },
            {
              title: 'Contract',
              url: '/stake/contract',
              icon: TrendingUp,
            },
            {
              title: 'User Stake List',
              url: '/stake/user-stake-list',
              icon: Users,
            },
          ],
        },
        {
          title: 'Additional',
          icon: FileText,
          items: [
            {
              title: 'News',
              url: '/additional/news',
              icon: FileText,
            },
          ],
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
