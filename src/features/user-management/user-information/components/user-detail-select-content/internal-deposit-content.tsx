type InternalDepositContentProps = {
  userId: string
}

export function InternalDepositContent({
  userId: _userId,
}: InternalDepositContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Internal Deposit table will be displayed here
      </div>
    </div>
  )
}
