# API Service бүтэц

## 📁 Folder Structure

### 1. **`src/lib/api.ts`** - Shared API Client
- `apiClient` - Axios instance (interceptors, base URL)
- `authService` - Authentication related API calls
- Бүх feature-ууд энд байгаа `apiClient`-ийг ашиглах

### 2. **`src/features/{feature}/data/service.ts`** - Feature-specific Services
- Feature-тэй холбоотой API service-ууд
- `apiClient`-ийг import хийж ашиглах
- Жишээ: `features/kyc-info/data/service.ts`

## 🎯 Best Practices

### ✅ Зөв:
```typescript
// features/kyc-info/data/service.ts
import { apiClient } from '@/lib/api'

export const usersService = {
  list: async (body: Record<string, unknown> = {}) => {
    // Token нь apiClient interceptor-оор автоматаар нэмэгдэнэ
    const response = await apiClient.post('/users/list', body)
    return response.data
  },
}
```

### ❌ Буруу:
```typescript
// Бие даасан fetch ашиглах
const res = await fetch(`${API_URL}/users/list`, {
  headers: {
    Authorization: `Bearer ${token}`, // Token manually нэмэх
  },
})
```

## 📝 API Service үүсгэх

### 1. Feature-specific service үүсгэх

```typescript
// features/tasks/data/service.ts
import { apiClient } from '@/lib/api'

export interface Task {
  id: string
  title: string
  status: string
}

export const tasksService = {
  list: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks')
    return response.data.body
  },

  create: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await apiClient.post('/tasks', task)
    return response.data.body
  },

  update: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put(`/tasks/${id}`, task)
    return response.data.body
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`)
  },
}
```

### 2. Shared service-ууд `lib/api.ts`-д нэмэх

```typescript
// lib/api.ts
export const commonService = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
```

## 🔄 API Client Features

### Автоматаар хийгддэг:
- ✅ Token нэмэх (Request interceptor)
- ✅ 401 error-д logout (Response interceptor)
- ✅ Base URL тохируулах
- ✅ Content-Type header

### Жишээ:
```typescript
// Token автоматаар нэмэгдэнэ
const response = await apiClient.get('/users')
// → GET http://localhost:3000/api/users
// → Headers: { Authorization: 'Bearer <token>' }
```

## 📂 Folder бүтэц

```
src/
├── lib/
│   └── api.ts              # Shared API client + common services
│
└── features/
    ├── auth/                # Auth feature (authService нь lib/api.ts-д)
    │
    ├── kyc-info/
    │   └── data/
    │       └── service.ts   # KYC feature API services
    │
    ├── tasks/
    │   └── data/
    │       └── service.ts   # Tasks feature API services
    │
    └── settings/
        └── data/
            └── service.ts   # Settings feature API services
```

## 💡 Санал

### Feature-specific services:
- `features/{feature}/data/service.ts` - API service-ууд
- `features/{feature}/data/schema.ts` - TypeScript types/schemas
- `features/{feature}/data/data.ts` - Mock data (dev only)

### Shared services:
- `lib/api.ts` - API client + auth service
- `lib/api/common.ts` - Common services (upload, etc.)

## 🚀 Usage Example

```typescript
// Component-д ашиглах
import { useQuery, useMutation } from '@tanstack/react-query'
import { usersService } from '@/features/kyc-info/data/service'

function UsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.list(),
  })

  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      // Invalidate queries
    },
  })

  return <div>...</div>
}
```
