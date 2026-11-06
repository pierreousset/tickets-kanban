import { useId, useState } from 'react'
import type { SubmitEvent } from 'react'
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

import type { CreateTicketInput } from '../types'

type CreateTicketDialogProps = {
  onCreate: (input: CreateTicketInput) => Promise<void>
}

const CreateTicketDialog = ({ onCreate }: CreateTicketDialogProps) => {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const id = useId()

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null)

      try {
        await onCreate({
          title: value.title.trim(),
          description: value.description.trim(),
        })

        setOpen(false)
        formApi.reset()
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Création impossible.',
        )
      }
    },
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (form.state.isSubmitting) return

    if (nextOpen) {
      form.reset()
      setSubmitError(null)
    }

    setOpen(nextOpen)
  }

  const handleFormSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      await form.handleSubmit()
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Envoi impossible.',
      )
    }
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

        <form noValidate onSubmit={handleFormSubmit}>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <fieldset disabled={isSubmitting} className="space-y-4">
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
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
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
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        rows={4}
                        placeholder="Précise ce qui doit être réalisé…"
                      />
                    </div>
                  )}
                </form.Field>

                {submitError && (
                  <p role="alert" className="text-sm text-destructive">
                    {submitError}
                  </p>
                )}

                <DialogFooter>
                  <DialogClose
                    render={<Button type="button" variant="outline" />}
                  >
                    Annuler
                  </DialogClose>

                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Création…' : 'Créer le ticket'}
                  </Button>
                </DialogFooter>
              </fieldset>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateTicketDialog }
