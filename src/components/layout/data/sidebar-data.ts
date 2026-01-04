import {
  Briefcase,
  Building2,
  Gavel,
  HandCoins,
  Key,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { LogoImage } from '../logo-image'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Xmeta Admin Dashboard',
      logo: LogoImage,
      plan: 'Xmeta Admin Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'Ерөнхий',
      items: [
        {
          title: 'Хянах самбар',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Газрын зураг',
          url: '/map',
          icon: MapPin,
        },
        {
          title: 'Хэрэглэгчид',
          icon: Users,
          items: [
            {
              title: 'Админүүд',
              url: '/admins',
              icon: UserCog,
            },
            {
              title: 'Эдийн засагчид',
              url: '/economists',
              icon: Briefcase,
            },
            {
              title: 'Үйлчлүүлэгчид',
              url: '/customers',
              icon: Users,
            },
          ],
        },
        {
          title: 'Салбар',
          url: '/branches',
          icon: Building2,
        },
        {
          title: 'Зээл',
          icon: HandCoins,
          items: [
            {
              title: 'Бүх зээлүүд',
              url: '/loans',
            },

            {
              title: 'Зээл оруулах',
              url: '/loans/import',
            },
            {
              title: 'Зээл статус',
              url: '/loans/status',
            },
          ],
        },
        {
          title: 'Шүүх',
          icon: Gavel,
          items: [
            {
              title: 'Хаах төлөв',
              url: '/judge-close-status',
            },
          ],
        },
      ],
    },
    {
      title: 'Хуудас',
      items: [
        {
          title: 'Нэвтрэх эрх',
          icon: ShieldCheck,
          items: [
            {
              title: 'Нууц үг солих',
              url: '/update-password',
              icon: Key,
            },
          ],
        },
      ],
    },
  ],
}
