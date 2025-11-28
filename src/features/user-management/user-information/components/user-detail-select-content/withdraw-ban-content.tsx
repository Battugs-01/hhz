type WithdrawBanContentProps = {
  userId: string
}

export function WithdrawBanContent({
  userId: _userId,
}: WithdrawBanContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Withdraw Ban information will be displayed here
      </div>
    </div>
  )
}
