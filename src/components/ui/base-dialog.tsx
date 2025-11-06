import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string | ReactNode
  description?: string | ReactNode
  children: ReactNode
  footer?: ReactNode
  submitButton?: {
    text?: string
    formId?: string
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
  }
  cancelButton?: {
    text?: string
    onClick?: () => void
    show?: boolean
  }
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  contentClassName?: string
  showCloseButton?: boolean
  onClose?: () => void
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  submitButton,
  cancelButton,
  maxWidth = 'lg',
  className,
  contentClassName,
  showCloseButton = true,
  onClose,
}: BaseDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      onClose()
    }
    onOpenChange(newOpen)
  }

  const defaultFooter = (
    <DialogFooter className='gap-y-2'>
      {cancelButton?.show !== false && (
        <Button
          type='button'
          variant='outline'
          onClick={cancelButton?.onClick || (() => handleOpenChange(false))}
        >
          {cancelButton?.text || 'Cancel'}
        </Button>
      )}
      {submitButton && (
        <Button
          type={submitButton.formId ? 'submit' : 'button'}
          form={submitButton.formId}
          onClick={submitButton.onClick}
          disabled={submitButton.disabled || submitButton.loading}
        >
          {submitButton.loading ? 'Loading...' : submitButton.text || 'Submit'}
        </Button>
      )}
    </DialogFooter>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(maxWidthClasses[maxWidth], contentClassName)}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader className='text-start'>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className={cn('overflow-y-auto', className)}>{children}</div>
        {footer !== undefined
          ? footer
          : submitButton || cancelButton?.show !== false
            ? defaultFooter
            : null}
      </DialogContent>
    </Dialog>
  )
}
