import { useId, useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { Button } from '@repo/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import { Textarea } from '@repo/ui/components/textarea'

import type { Ticket } from '../types'

type CreateTicketDialogProps = {
  onCreate: (ticket: Ticket) => void
}

export function CreateTicketDialog({ onCreate }: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    onSubmit: ({ value }) => {
      onCreate({
        id: crypto.randomUUID(),
        title: value.title.trim(),
        description: value.description.trim(),
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      setOpen(false)
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      form.reset()
    }

    setOpen(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        Nouveau ticket
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un ticket</DialogTitle>
          <DialogDescription>
            Décris une tâche à réaliser pour ton projet.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 3
                  ? 'Le titre doit contenir au moins 3 caractères.'
                  : undefined,
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <div className="space-y-2">
                  <Label htmlFor={`${id}-title`}>Titre</Label>

                  <Input
                    id={`${id}-title`}
                    name={field.name}
                    required
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    aria-describedby={
                      isInvalid ? `${id}-title-error` : undefined
                    }
                    placeholder="Ex. Ajouter la page des projets"
                  />

                  {isInvalid && (
                    <p
                      id={`${id}-title-error`}
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {field.state.meta.errors.join(' ')}
                    </p>
                  )}
                </div>
              )
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>
                  Description — facultative
                </Label>

                <Textarea
                  id={`${id}-description`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={4}
                  placeholder="Précise ce qui doit être réalisé…"
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Annuler
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  Créer le ticket
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
