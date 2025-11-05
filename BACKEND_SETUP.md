# Back-end API Integration Guide

## ✅ Хийгдсэн өөрчлөлтүүд

### 1. **API Service сайжруулсан** (`src/lib/api.ts`)
- ✅ Axios ашиглахаар шилжүүлсэн (fetch-ээс)
- ✅ Request interceptor нэмсэн - token автоматаар нэмэгдэнэ
- ✅ Response interceptor нэмсэн - 401 error-д автоматаар logout хийх
- ✅ `apiClient` export хийсэн - бусад API call-уудад ашиглах

### 2. **Authentication Guard нэмсэн**
- ✅ `_authenticated` route-д `beforeLoad` нэмсэн
- ✅ Token эсвэл user байхгүй бол `/sign-in` руу redirect хийх

### 3. **Sign-in Form шинэчлэсэн**
- ✅ `getUserInfo()` одоо token параметр шаардахгүй (interceptor-оор автоматаар)

## 🔧 Environment Variables тохируулах

### 1. `.env` файл үүсгэх

Төслийн root folder-д (package.json-ийн хажууд) `.env` файл үүсгэх:

```bash
# Back-end API URL
VITE_API_URL=http://localhost:3000/api
```

**Жишээ:**
- Local development: `VITE_API_URL=http://localhost:3000/api`
- Production: `VITE_API_URL=https://api.yourdomain.com/api`

### 2. `.env` файлыг `.gitignore`-д нэмэх

```gitignore
.env
.env.local
.env.production
```

## 📡 API Endpoints

### Back-end-д хэрэгтэй endpoints:

1. **POST `/auth/login`**
   ```typescript
   Request: {
     email: string
     password: string
   }
   
   Response: {
     body: {
       token: string
       adminUser: {
         id: string
         email: string
         adminGroupId: string
         adminGroup: any
         status: string
         isEnabled: boolean
         userCreateDate: string
         password: string
         two_factor_enabled: boolean
         created_at: string
         updated_at: string
       }
     }
   }
   ```

2. **GET `/auth/info`**
   - Header: `Authorization: Bearer <token>`
   
   ```typescript
   Response: {
     body: {
       id: string
       email: string
       adminGroupId: string
       adminGroup: any
       status: string
       isEnabled: boolean
       userCreateDate: string
       password: string
       two_factor_enabled: boolean
       created_at: string
       updated_at: string
     }
   }
   ```

3. **POST `/auth/logout`** (optional)
   - Header: `Authorization: Bearer <token>`
   - Хэрэв байхгүй бол зөвхөн client-side logout хийх

## 🔐 Authentication Flow

### 1. Sign In
```
User enters email/password
  ↓
POST /auth/login
  ↓
Save token to auth store
  ↓
GET /auth/info (token автоматаар нэмэгдэнэ)
  ↓
Save user data
  ↓
Redirect to dashboard
```

### 2. Protected Routes
```
User navigates to /_authenticated/*
  ↓
beforeLoad checks token & user
  ↓
If not authenticated → redirect to /sign-in
  ↓
If authenticated → render component
```

### 3. API Calls
```
Any API call using apiClient
  ↓
Request interceptor adds token
  ↓
If 401 error → logout & redirect to /sign-in
```

## 💻 Usage Examples

### 1. API call хийх

```typescript
import { apiClient } from '@/lib/api'

// GET request
const response = await apiClient.get('/users')
const users = response.data

// POST request
const response = await apiClient.post('/users', { name: 'John' })

// PUT request
const response = await apiClient.put('/users/1', { name: 'Jane' })

// DELETE request
const response = await apiClient.delete('/users/1')
```

### 2. Auth store ашиглах

```typescript
import { useAuthStore } from '@/stores/auth-store'

function MyComponent() {
  const { auth } = useAuthStore()
  
  // Access token
  const token = auth.accessToken
  
  // Access user
  const user = auth.user
  
  // Logout
  auth.reset()
}
```

### 3. Logout хийх

```typescript
import { authService } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

async function handleLogout() {
  try {
    await authService.logout()
  } catch (error) {
    console.log('Logout API not available')
  }
  
  // Client-side logout
  useAuthStore.getState().auth.reset()
  window.location.href = '/sign-in'
}
```

## 🚨 Error Handling

### 401 Unauthorized
- Response interceptor автоматаар logout хийж, `/sign-in` руу redirect хийнэ

### 403 Forbidden
- QueryCache-д error handler байна (одоогоор зөвхөн console.log)

### 500 Server Error
- QueryCache-д error handler байна, `/500` page руу redirect хийнэ

## 📝 Notes

- Clerk нь зөвхөн `src/routes/clerk/` folder-д байгаа optional example
- Үндсэн auth систем нь өөрийн back-end-тэй холбогдсон
- Clerk-ийг арилгах шаардлагагүй, хэрэв ашиглахгүй бол зөвхөн үлдээж болно

## 🔍 Debugging

### API URL шалгах
```typescript
console.log(import.meta.env.VITE_API_URL)
```

### Token шалгах
```typescript
import { useAuthStore } from '@/stores/auth-store'
console.log(useAuthStore.getState().auth.accessToken)
```

### Network requests шалгах
- Browser DevTools → Network tab
- Бүх request-д `Authorization` header нэмэгдсэн эсэхийг шалгах
