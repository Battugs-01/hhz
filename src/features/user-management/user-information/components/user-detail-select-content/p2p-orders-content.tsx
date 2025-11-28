type P2POrdersContentProps = {
  userId: string
}

export function P2POrdersContent({ userId: _userId }: P2POrdersContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        P2P orders table will be displayed here
      </div>
    </div>
  )
}
