# KYC Info Table Component бүтэц

## 📁 Одоогийн бүтэц

```
features/kyc-info/components/
├── kyc-info-table.tsx          # Main table component (TanStack Table)
├── users-columns.tsx           # Column definitions
├── data-table-bulk-actions.tsx # Bulk actions toolbar
├── data-table-row-actions.tsx # Row actions dropdown
├── users-dialogs.tsx           # Dialogs wrapper (render хийж байна)
├── users-action-dialog.tsx     # Add/Edit dialog
├── users-invite-dialog.tsx     # Invite dialog
├── users-delete-dialog.tsx     # Delete dialog
├── users-multi-delete-dialog.tsx # Multi delete dialog
├── users-primary-buttons.tsx   # Primary buttons (Add, Invite)
└── users-provider.tsx          # Context provider (dialog state)
```

## 🤔 Хэрэгтэй эсэх?

### ✅ Хэрэгтэй (Separation of Concerns):
1. **kyc-info-table.tsx** - Main table logic
2. **users-columns.tsx** - Column definitions
3. **data-table-bulk-actions.tsx** - Bulk actions logic
4. **data-table-row-actions.tsx** - Row actions
5. **users-action-dialog.tsx** - Add/Edit form
6. **users-invite-dialog.tsx** - Invite form
7. **users-delete-dialog.tsx** - Delete confirmation
8. **users-multi-delete-dialog.tsx** - Multi delete
9. **users-provider.tsx** - Context (dialog state management)

### ❓ Нэгтгэж болох (Optional):
1. **users-dialogs.tsx** - Зөвхөн dialogs render хийж байна
   - `index.tsx` дотор шууд хийж болно
2. **users-primary-buttons.tsx** - Зөвхөн 2 button
   - `index.tsx` дотор шууд хийж болно

## 💡 Санал

### Сонголт 1: Одоогийн бүтэц (Recommended)
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Easy to maintain
- ✅ Testable

### Сонголт 2: Энгийн бүтэц (Хэрэв хүсвэл)
- `users-dialogs.tsx` → `index.tsx` дотор шууд
- `users-primary-buttons.tsx` → `index.tsx` дотор шууд

## 🎯 Дүгнэлт

**Одоогийн бүтэц нь зөв байна**, учир нь:
- Dialog component-ууд тусдаа байх нь зөв (reusable, testable)
- Column definitions тусдаа байх нь зөв
- Context provider нь state management-д хэрэгтэй

**Гэхдээ** хэрэв илүү энгийн хүсвэл:
- `users-dialogs.tsx` болон `users-primary-buttons.tsx`-ийг `index.tsx` дотор нэгтгэж болно
