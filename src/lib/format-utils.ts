// Format currency helper
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('MNT', '₮')
}

// Format loan date (20240101 -> 2024.01.01)
export const formatLoanDate = (dateNum: number): string => {
  const dateStr = String(dateNum)
  if (dateStr.length !== 8) return dateStr
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  return `${year}.${month}.${day}`
}

// Get overdue status badge
export const getOverdueStatus = (days: number) => {
  if (days === 0)
    return {
      label: 'Хэвийн',
      variant: 'default' as const,
      color: 'text-green-600',
    }
  if (days <= 30)
    return {
      label: 'Анхаарал',
      variant: 'secondary' as const,
      color: 'text-yellow-600',
    }
  if (days <= 60)
    return {
      label: 'Муу зээл',
      variant: 'outline' as const,
      color: 'text-orange-600',
    }
  return {
    label: 'Ноцтой',
    variant: 'destructive' as const,
    color: 'text-red-600',
  }
}
