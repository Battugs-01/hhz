# Төслийн бүтэц ба Routing системийн тайлбар

## 📁 Folder Structure (Фолдер бүтэц)

### 1. **Root Level** (Үндсэн түвшин)
```
src/
├── main.tsx              # App-ийн entry point
├── routeTree.gen.ts      # Auto-generated route tree (TanStack Router үүсгэдэг)
├── routes/               # Бүх routing файлууд
├── features/             # Feature-based бүтэц (бизнес логик)
├── components/           # Shared компонентүүд
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, helpers
├── stores/               # State management (Zustand)
├── context/              # React Context providers
└── styles/               # CSS файлууд
```

### 2. **Routes Folder** (Routing систем)
TanStack Router ашигладаг **file-based routing** систем:

```
routes/
├── __root.tsx                    # Root layout (бүх route-уудын эцэг)
├── _authenticated/               # Authenticated routes (нэвтрэгдсэн хэрэглэгч)
│   ├── route.tsx                 # Layout wrapper
│   ├── index.tsx                 # /dashboard (home)
│   ├── apps/
│   ├── chats/
│   ├── kyc-info/
│   ├── settings/
│   └── tasks/
├── (auth)/                       # Auth routes (нэвтрээгүй хэрэглэгч)
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── forgot-password.tsx
│   └── otp.tsx
├── (errors)/                     # Error pages
│   ├── 401.tsx
│   ├── 403.tsx
│   ├── 404.tsx
│   ├── 500.tsx
│   └── 503.tsx
└── clerk/                        # Clerk authentication routes
```

### 3. **Features Folder** (Feature-based бүтэц)
Feature-based architecture - функционал бүр нь тусдаа folder:

```
features/
├── auth/                    # Authentication feature
│   ├── auth-layout.tsx
│   ├── sign-in/
│   │   ├── index.tsx
│   │   └── components/
│   ├── sign-up/
│   ├── forgot-password/
│   └── otp/
├── dashboard/               # Dashboard feature
├── kyc-info/                # KYC information feature
│   ├── index.tsx
│   ├── components/
│   └── data/
├── settings/                # Settings feature
├── tasks/                   # Tasks feature
└── chats/                   # Chats feature
```

## 🛣️ Routing систем (TanStack Router)

### Routing файлын жишээ:
```tsx
// routes/(auth)/sign-in.tsx
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema, // Optional: URL search params validation
})
```

### Route naming conventions:
- `__root.tsx` - Root route
- `_authenticated/` - Layout route (prefix `_` нь URL-д гардаггүй)
- `(auth)/` - Route group (prefix `()` нь URL-д гардаггүй)
- `index.tsx` - Folder-ийн default route
- `route.tsx` - Layout/group route

### URL mapping:
```
routes/_authenticated/index.tsx     → /
routes/_authenticated/tasks/index.tsx → /tasks
routes/(auth)/sign-in.tsx           → /sign-in
routes/(auth)/forgot-password.tsx   → /forgot-password
routes/_authenticated/settings/index.tsx → /settings
```

## 🔄 Data Flow (Өгөгдлийн урсгал)

### 1. **App Initialization** (main.tsx)
```
main.tsx
  ├── QueryClientProvider (React Query)
  ├── ThemeProvider
  ├── FontProvider
  ├── DirectionProvider
  └── RouterProvider (TanStack Router)
      └── routeTree (auto-generated)
```

### 2. **Route Rendering**
```
__root.tsx (Root Layout)
  ├── NavigationProgress
  ├── Outlet (child routes render here)
  ├── Toaster (notifications)
  └── DevTools (dev mode only)
```

### 3. **Layout System**
```
Authenticated Routes:
  _authenticated/route.tsx
    └── AuthenticatedLayout
        ├── SidebarProvider
        ├── AppSidebar
        └── SidebarInset
            └── <Outlet /> (child routes)

Auth Routes:
  (auth)/sign-in.tsx
    └── SignIn component
        └── AuthLayout (wrapper)
```

## 📦 Key Technologies

### 1. **TanStack Router**
- File-based routing
- Type-safe routing
- Automatic code splitting
- Route preloading

### 2. **React Query** (@tanstack/react-query)
- Server state management
- Caching & synchronization
- Error handling

### 3. **Zustand**
- Client state management
- Auth store (`stores/auth-store.ts`)

### 4. **Feature-based Architecture**
- Features folder нь бизнес логикийг агуулна
- Routes folder нь зөвхөн routing тодорхойлолт
- Components folder нь shared UI компонентүүд

## 🎯 Жишээ: Шинэ route нэмэх

### 1. Route файл үүсгэх:
```tsx
// routes/_authenticated/products/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Products } from '@/features/products'

export const Route = createFileRoute('/_authenticated/products/')({
  component: Products,
})
```

### 2. Feature үүсгэх:
```tsx
// features/products/index.tsx
export function Products() {
  return <div>Products Page</div>
}
```

### 3. RouteTree автоматаар шинэчлэгдэнэ:
- Vite dev server нь файлын өөрчлөлтийг мэдэрдэг
- `routeTree.gen.ts` автоматаар шинэчлэгдэнэ

## 🔍 Folder naming patterns

### Routes folder:
- `_authenticated` - Layout route (authenticated users)
- `(auth)` - Route group (auth pages)
- `(errors)` - Route group (error pages)
- `index.tsx` - Default route for folder
- `route.tsx` - Layout/group wrapper

### Features folder:
- Feature нэртэй folder
- `index.tsx` - Main component export
- `components/` - Feature-specific components
- `data/` - Data types, schemas, services

## 📝 Important Files

### 1. `main.tsx`
- App-ийн entry point
- Router, QueryClient, Providers-ийг setup хийж байна

### 2. `routes/__root.tsx`
- Root layout
- Бүх route-уудын wrapper
- Global components (Toaster, DevTools)

### 3. `vite.config.ts`
- TanStack Router plugin
- Auto route tree generation
- Path aliases (`@/` → `src/`)

### 4. `routeTree.gen.ts`
- Auto-generated file
- Бүх route-уудын tree structure
- **DO NOT EDIT manually**

## 🚀 Development Workflow

1. **Route үүсгэх**: `routes/` folder-д файл нэмэх
2. **Feature үүсгэх**: `features/` folder-д бизнес логик бичих
3. **Component үүсгэх**: `components/` folder-д shared компонент
4. **RouteTree шинэчлэгдэнэ**: Vite автоматаар шинэчлэнэ
5. **Type safety**: TypeScript нь route-уудыг type-check хийнэ

## 💡 Tips

- Route файлууд нь зөвхөн routing config агуулна
- Бизнес логик нь features folder-д байна
- Shared компонентүүд нь components folder-д байна
- `routeTree.gen.ts` файлыг хэзээ ч засах хэрэггүй
- File naming нь routing-д нөлөөлдөг
