type AssetContentProps = {
  userId: string
}

export function AssetContent({ userId: _userId }: AssetContentProps) {
  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='text-muted-foreground py-8 text-center'>
        Asset table will be displayed here
      </div>
    </div>
  )
}
