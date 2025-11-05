# Services Folder бүтэц

## 📁 Folder Structure

```
src/services/
├── api/                    # API service files
│   ├── client.ts           # Axios instance (interceptors, base URL)
│   ├── auth.service.ts     # Authentication API calls
│   └── kyc.service.ts      # KYC/Users API calls
│
├── types/                  # TypeScript types & schemas
│   ├── auth.types.ts       # Auth related types
│   └── kyc.types.ts         # KYC/Users related types
│
└── index.ts                # Barrel export (all exports)
```

## 🎯 Usage

### Import API Services

```typescript
// Barrel import (recommended)
import { authService, kycService, apiClient } from '@/services'

// Specific import
import { authService } from '@/services/api/auth.service'
import { kycService } from '@/services/api/kyc.service'
```

### Import Types

```typescript
// Barrel import (recommended)
import type { LoginCredentials, User, UserStatus } from '@/services'

// Specific import
import type { LoginCredentials } from '@/services/types/auth.types'
import type { User, UserStatus } from '@/services/types/kyc.types'
```

## 📝 Жишээ

### 1. Auth Service ашиглах

```typescript
import { authService } from '@/services'
import { useMutation } from '@tanstack/react-query'

function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // data.body.token
      // data.body.adminUser
    },
  })

  return <form>...</form>
}
```

### 2. KYC Service ашиглах

```typescript
import { kycService } from '@/services'
import type { UserList } from '@/services'
import { useQuery } from '@tanstack/react-query'

function UsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => kycService.listUsers({ page: 1, pageSize: 10 }),
  })

  return <div>...</div>
}
```

### 3. API Client ашиглах (custom API call)

```typescript
import { apiClient } from '@/services'

async function customApiCall() {
  const response = await apiClient.get('/custom-endpoint')
  return response.data
}
```

## 🔄 Migration

### Одоогийн бүтэц → Шинэ бүтэц

#### Before:
```typescript
import { authService, apiClient } from '@/lib/api'
```

#### After:
```typescript
import { authService, apiClient } from '@/services'
```

### Legacy Support

`src/lib/api.ts` файл одоо legacy support-ын тулд байна. Энэ нь зөвхөн re-export хийж байгаа тул:
- ✅ Одоогийн код ажиллах болно
- ⚠️ Шинэ код бичихдээ `@/services` ашиглах хэрэгтэй

## 📦 Шинэ Service үүсгэх

### 1. Types үүсгэх

```typescript
// services/types/tasks.types.ts
import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['pending', 'completed']),
})

export type Task = z.infer<typeof taskSchema>
```

### 2. Service үүсгэх

```typescript
// services/api/tasks.service.ts
import { apiClient } from './client'
import type { Task } from '../types/tasks.types'

export const tasksService = {
  list: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks')
    return response.data
  },

  create: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', task)
    return response.data
  },
}
```

### 3. Index.ts-д export хийх

```typescript
// services/index.ts
export { tasksService } from './api/tasks.service'
export type { Task } from './types/tasks.types'
```

## 🎨 Best Practices

### ✅ Зөв:
- Service-уудыг feature-ээр бүлэглэх
- Types-уудыг feature-ээр бүлэглэх
- Barrel export (`index.ts`) ашиглах
- `apiClient`-ийг бүх service-уудад ашиглах

### ❌ Буруу:
- Бие даасан fetch ашиглах
- Types-уудыг service файлд бичих
- apiClient-ийг давтах (interceptor-ууд алдаатай)

## 📚 Available Services

### Auth Service
- `login(credentials)` - Sign in
- `getUserInfo()` - Get current user info
- `logout()` - Sign out

### KYC Service
- `listUsers(body)` - Get users list

## 🔐 API Client Features

- ✅ Token автоматаар нэмэх (Request interceptor)
- ✅ 401 error-д автоматаар logout (Response interceptor)
- ✅ Base URL тохируулах
- ✅ Content-Type header
