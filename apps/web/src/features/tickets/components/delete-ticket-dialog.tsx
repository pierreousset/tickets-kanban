import { useRef, useState, type ComponentProps } from 'react'

import { Button } from '@repo/ui/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog'

import type { TicketView } from '../types'

type OpenChangeHandler = NonNullable<
  ComponentProps<typeof AlertDialog>['onOpenChange']
>

type DeleteTicketDialogProps = {
  ticket: TicketView | null
  hidden: boolean
  disabled: boolean
  onDelete: (id: string) => Promise<void>
  onDeleted: () => void
}

const DeleteTicketDialog = ({
  ticket,
  hidden,
  disabled,
  onDelete,
  onDeleted,
}: DeleteTicketDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [target, setTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  const cancelRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasDeletedRef = useRef(false)

  const handleOpenChange: OpenChangeHandler = (nextOpen, details) => {
    if (isDeleting) {
      details.cancel()
      return
    }

    if (nextOpen) {
      if (!ticket || hidden || disabled) {
        details.cancel()
        return
      }

      setTarget({ id: ticket.id, title: ticket.title })
      setError(null)
      wasDeletedRef.current = false
    }

    setOpen(nextOpen)
  }

  const handleDelete = async () => {
    if (!target || isDeleting) return

    setIsDeleting(true)
    setError(null)

    try {
      await onDelete(target.id)

      wasDeletedRef.current = true
      setOpen(false)
      onDeleted()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Impossible de supprimer ce ticket.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {!hidden && ticket && (
        <AlertDialogTrigger
          ref={triggerRef}
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="destructive"
              className="w-full"
            />
          }
        >
          Supprimer le ticket
        </AlertDialogTrigger>
      )}

      <AlertDialogContent
        initialFocus={cancelRef}
        finalFocus={() =>
          wasDeletedRef.current ? false : triggerRef.current
        }
        aria-busy={isDeleting}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce ticket ?</AlertDialogTitle>
          <AlertDialogDescription>
            « {target?.title} » sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef} disabled={isDeleting}>
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Suppression…' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteTicketDialog }