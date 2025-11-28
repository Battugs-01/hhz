type OrdersContentProps = {
  userId: string
}

export function OrdersContent({ userId: _userId }: OrdersContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Orders table will be displayed here
      </div>
    </div>
  )
}
