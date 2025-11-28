type NetAssetsTabProps = {
  user: { id: string }
}

export function NetAssetsTab({ user: _user }: NetAssetsTabProps) {
  // Placeholder for now - can be enhanced with real API data later
  const netAssetsUSDT = '11.80'

  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='space-y-4'>
        <div className='text-center'>
          <div className='text-muted-foreground mb-4 text-sm font-medium'>
            Net Assets(BTC)≈ {netAssetsUSDT} USDT
          </div>
          <div className='text-5xl font-bold'>{netAssetsUSDT}</div>
        </div>
        <div className='text-muted-foreground mt-6 text-center text-xs'>
          This is a placeholder. Real asset data will be integrated later.
        </div>
      </div>
    </div>
  )
}
