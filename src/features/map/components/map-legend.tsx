interface MapLegendProps {
  loanCount: number
  workerCount: number
}

export function MapLegend({ loanCount, workerCount }: MapLegendProps) {
  return (
    <div className='bg-muted/30 border-t p-2 px-4 flex items-center justify-between text-xs text-muted-foreground'>
      <div className='flex gap-4'>
        <span className='flex items-center gap-1'><div className='w-2 h-2 rounded-full bg-[#10b981]' /> Хэвийн</span>
        <span className='flex items-center gap-1'><div className='w-2 h-2 rounded-full bg-[#eab308]' /> Анхаарал</span>
        <span className='flex items-center gap-1'><div className='w-2 h-2 rounded-full bg-[#ef4444]' /> Ноцтой</span>
        <span className='flex items-center gap-1'><div className='w-2 h-2 rounded-full bg-[#94a3b8]' /> Буруу хаяг</span>
        <span className='flex items-center gap-1'><div className='w-2 h-2 rounded-full bg-[#f59e0b]' /> Ажилтан tracking</span>
      </div>
      <span>{loanCount} зээл, {workerCount} ажилтан харагдаж байна</span>
    </div>
  )
}
