import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'

type UpdateStatusButtonProps = {
  usersStakeId: string
  onUpdateStatus: (usersStakeId: string, status: string) => Promise<void>
}

export function UpdateStatusButton({
  usersStakeId,
  onUpdateStatus,
}: UpdateStatusButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onUpdateStatus(usersStakeId, 'cancel_requested')
      setOpen(false)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() => setOpen(true)}
      >
        Update
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title='Confirm Status Change'
        desc='Та энэ хүсэлтийг Requested төлөврүү шилжүүлэхдээ итгэлтэй байна уу?'
        confirmText='Зөвшөөрөх'
        cancelBtnText='Цуцлах'
        handleConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  )
}
