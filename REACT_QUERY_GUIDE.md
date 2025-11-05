# React Query: useQuery vs useMutation

## 🔍 useQuery - GET хүсэлт (Өгөгдөл унших)

### Тодорхойлолт:
- **GET** request-ууд зориулагдсан
- Өгөгдөл унших, fetch хийх
- Автоматаар cache хийх, refetch хийх
- Component mount хийхэд автоматаар дуудагдана

### Онцлог:
- ✅ Автоматаар дуудагдана (component mount үед)
- ✅ Cache хийх (staleTime, cacheTime)
- ✅ Background refetch (refetchOnWindowFocus, refetchInterval)
- ✅ Loading state автоматаар
- ✅ Error handling автоматаар

### Жишээ:
```typescript
import { useQuery } from '@tanstack/react-query'

// GET request - list авах
const { data, isLoading, error } = useQuery({
  queryKey: ['users', page, pageSize],
  queryFn: () => usersService.list({ page, pageSize }),
  staleTime: 5 * 60 * 1000, // 5 минут
  refetchOnWindowFocus: true,
})

// GET request - user info авах
const { data: userInfo } = useQuery({
  queryKey: ['user-info'],
  queryFn: () => authService.getUserInfo(),
  enabled: !!token, // Token байвал дуудах
})
```

### Use Cases:
- ✅ Data list авах
- ✅ Detail мэдээлэл авах
- ✅ User info авах
- ✅ Settings авах
- ✅ Дахин авах шаардлагатай өгөгдөл

---

## ✏️ useMutation - POST/PUT/DELETE хүсэлт (Өгөгдөл бичих)

### Тодорхойлолт:
- **POST**, **PUT**, **DELETE**, **PATCH** request-ууд зориулагдсан
- Өгөгдөл бичих, update хийх, устгах
- Manual trigger (user action-аар дуудагдана)
- Cache update хийх (onSuccess дээр)

### Онцлог:
- ❌ Автоматаар дуудагдахгүй (manual trigger)
- ❌ Cache хийхгүй
- ✅ Loading state (isPending)
- ✅ Error handling
- ✅ onSuccess, onError callbacks

### Жишээ:
```typescript
import { useMutation } from '@tanstack/react-query'

// POST request - login хийх
const loginMutation = useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
    // Login амжилттай болсон
    auth.saveToken(data.body.token)
    navigate('/dashboard')
  },
  onError: (error) => {
    // Login алдаа гарсан
    toast.error(error.message)
  },
})

// Хэрэглэх:
loginMutation.mutate({ email, password })
```

### Use Cases:
- ✅ Login/Signup
- ✅ Form submit
- ✅ Data create/update/delete
- ✅ Actions (approve, reject, etc.)

---

## 📊 Харьцуулалт

| Feature | useQuery | useMutation |
|---------|----------|-------------|
| **Request type** | GET | POST/PUT/DELETE/PATCH |
| **Auto trigger** | ✅ Автоматаар | ❌ Manual |
| **Cache** | ✅ Хийх | ❌ Хийхгүй |
| **Refetch** | ✅ Автоматаар | ❌ Хийхгүй |
| **Loading state** | `isLoading` | `isPending` |
| **Error state** | `isError`, `error` | `isError`, `error` |
| **Success callback** | ❌ | ✅ `onSuccess` |
| **Error callback** | ❌ | ✅ `onError` |
| **Manual execute** | `refetch()` | `mutate()` |

---

## 🎯 Жишээ: Use Cases

### ✅ useQuery ашиглах:

```typescript
// 1. List авах
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => usersService.list(),
})

// 2. Detail авах
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => usersService.getById(userId),
  enabled: !!userId, // userId байвал дуудах
})

// 3. User info авах (refresh хийхэд)
const { data: userInfo } = useQuery({
  queryKey: ['user-info'],
  queryFn: () => authService.getUserInfo(),
  refetchOnWindowFocus: true,
})
```

### ✅ useMutation ашиглах:

```typescript
// 1. Login
const loginMutation = useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
    auth.saveToken(data.body.token)
  },
})
loginMutation.mutate({ email, password })

// 2. Create
const createMutation = useMutation({
  mutationFn: usersService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
createMutation.mutate({ name: 'John' })

// 3. Update
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => usersService.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
updateMutation.mutate({ id: '1', data: { name: 'Jane' } })

// 4. Delete
const deleteMutation = useMutation({
  mutationFn: usersService.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
deleteMutation.mutate('1')
```

---

## 🔄 Хамтран ашиглах

### Query cache update хийх (mutation-ийн дараа):

```typescript
const queryClient = useQueryClient()

const createMutation = useMutation({
  mutationFn: usersService.create,
  onSuccess: () => {
    // Query cache-ийг update хийх
    queryClient.invalidateQueries({ queryKey: ['users'] })
    // Эсвэл
    queryClient.setQueryData(['users'], (old) => [...old, newUser])
  },
})
```

---

## 💡 Best Practices

### useQuery:
- ✅ GET request-ууд
- ✅ Cache хийх шаардлагатай өгөгдөл
- ✅ Дахин fetch хийх шаардлагатай өгөгдөл
- ✅ Loading state автоматаар хэрэгтэй үед

### useMutation:
- ✅ POST/PUT/DELETE request-ууд
- ✅ User action-аар trigger хийх
- ✅ Form submit
- ✅ onSuccess/onError callback хэрэгтэй үед

---

## 📝 Товч дүгнэлт

**useQuery:**
- "Өгөгдөл авах" - GET request
- Автоматаар дуудагдана
- Cache хийх

**useMutation:**
- "Өгөгдөл бичих" - POST/PUT/DELETE
- Manual trigger (mutate() дуудах)
- Cache update хийх (onSuccess дээр)
