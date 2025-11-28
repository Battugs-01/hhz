type ChangesLogContentProps = {
  userId: string
}

export function ChangesLogContent({ userId: _userId }: ChangesLogContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Changes Log table will be displayed here
      </div>
    </div>
  )
}
