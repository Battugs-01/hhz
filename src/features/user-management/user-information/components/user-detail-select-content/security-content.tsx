type SecurityContentProps = {
  userId: string
}

export function SecurityContent({ userId: _userId }: SecurityContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Security information will be displayed here
      </div>
    </div>
  )
}
