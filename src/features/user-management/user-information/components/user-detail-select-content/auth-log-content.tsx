type AuthLogContentProps = {
  userId: string
}

export function AuthLogContent({ userId: _userId }: AuthLogContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Auth Log table will be displayed here
      </div>
    </div>
  )
}
