# Authentication Flow - Login & Token Management

## 🔐 Login Flow

### 1. **Sign In Form** (`user-auth-form.tsx`)

```typescript
// User enters email & password
loginMutation.mutate({ email, password })

// ↓

// authService.login() дуудагдана
POST /auth/login
Body: { email, password }

// ↓

// Response:
{
  body: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    adminUser: { ... }
  }
}
```

### 2. **Token хадгалт** (`onSuccess` callback)

```typescript
// 1. Token-ийг cookie болон state-д хадгална
auth.saveToken(data.body.token)

// ↓ saveToken() function:
// - Cookie: setCookie('thisisjustarandomstring', JSON.stringify(token))
// - State: accessToken = token

// 2. User info авах
const userInfo = await authService.getUserInfo()

// ↓ getUserInfo():
// - GET /auth/info
// - Header: Authorization: Bearer {token}
// - Token нь interceptor-оор автоматаар нэмэгдэнэ

// 3. User мэдээлэл хадгална
auth.setUser(userInfo.body)

// ↓ setUser() function:
// - localStorage: localStorage.setItem('user_info', JSON.stringify(user))
// - State: user = userInfo.body
```

## 📦 Token Storage

### Cookie (Token)
- **Name**: `thisisjustarandomstring`
- **Value**: `JSON.stringify(token)` (string-ийг JSON.stringify хийж байна)
- **Max Age**: 7 days
- **Path**: `/`

### LocalStorage (User Info)
- **Key**: `user_info`
- **Value**: `JSON.stringify(user)`

### Zustand State
- **accessToken**: string (token value)
- **user**: AdminUser | null

## 🔄 Token ашиглах

### API Request Interceptor
```typescript
// services/api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 🔍 Authentication Guard

### Protected Routes (`_authenticated/route.tsx`)
```typescript
beforeLoad: () => {
  const { auth } = useAuthStore.getState()
  
  // Token эсвэл user байхгүй бол sign-in руу redirect
  if (!auth.accessToken || !auth.user) {
    throw redirect({ to: '/sign-in' })
  }
}
```

## ⚠️ Potential Issues

### 1. Token хадгалт
Одоо token-ийг JSON.stringify хийж хадгалж байна:
```typescript
setCookie(ACCESS_TOKEN, JSON.stringify(token))
```

Гэхдээ token нь string байна, тэгэхээр:
- ✅ JSON.stringify хийхэд зөв ажиллана (string → "string")
- ✅ JSON.parse хийхэд зөв ажиллана ("string" → string)

### 2. Token унших
```typescript
const cookieState = getCookie(ACCESS_TOKEN)
const initToken = cookieState && cookieState !== 'undefined' 
  ? JSON.parse(cookieState) 
  : ''
```

Энэ нь зөв ажиллаж байна.

## 🧪 Testing

### Login flow тест хийх:
1. ✅ Sign-in form-оор login хийх
2. ✅ Token cookie-д хадгалагдсан эсэхийг шалгах
3. ✅ User info localStorage-д хадгалагдсан эсэхийг шалгах
4. ✅ getUserInfo API call хийгдсэн эсэхийг шалгах
5. ✅ Dashboard руу redirect хийгдсэн эсэхийг шалгах

### Browser DevTools:
```javascript
// Token шалгах
document.cookie
// → "thisisjustarandomstring=..."

// User info шалгах
localStorage.getItem('user_info')
// → {"id":"...","email":"..."}

// State шалгах (React DevTools)
useAuthStore.getState().auth
// → { accessToken: "...", user: {...} }
```

## 🐛 Debugging

### Token хадгалагдсангүй бол:
1. Cookie settings шалгах (SameSite, Secure)
2. setCookie function ажиллаж байгаа эсэхийг шалгах
3. Console.log хийж token утгыг харах

### getUserInfo алдаа гарвал:
1. Token зөв хадгалагдсан эсэхийг шалгах
2. Interceptor зөв ажиллаж байгаа эсэхийг шалгах
3. Network tab дээр Authorization header-ийг шалгах
