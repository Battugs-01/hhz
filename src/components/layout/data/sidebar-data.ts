import {
    Briefcase,
    Building2,
    Command,
    Gavel,
    HandCoins,
    Key,
    MapPin,
    ScrollText,
    ShieldCheck,
    UserCog,
    Users
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'HHZ Admin Dashboard',
      logo: Command,
      plan: 'HHZ Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'Ерөнхий',
      items: [
        // {
        //   title: 'Хянах самбар',
        //   url: '/',
        //   icon: LayoutDashboard,
        // },
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
        {
          title: 'Тайлан',
          icon: ScrollText,
          items: [
            {
              title: 'Зээлийн тайлан',
              url: '/reports/loans',
            },
            {
              title: 'Шүүхийн зээлийн тайлан',
              url: '/reports/judge-loans',
            },
            {
              title: 'Зээлийн тэмдэглэл',
              url: '/reports/loan-notes',
            },
            {
              title: 'Шүүхийн зээлийн тэмдэглэл',
              url: '/reports/judge-loan-notes',
            },
          ],
        },
        {
          title: 'Лог бүртгэл',
          url: '/operation-logs',
          icon: ScrollText,
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
