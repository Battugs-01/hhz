type InternalWithdrawContentProps = {
  userId: string
}

export function InternalWithdrawContent({
  userId: _userId,
}: InternalWithdrawContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Internal Withdraw table will be displayed here
      </div>
    </div>
  )
}
