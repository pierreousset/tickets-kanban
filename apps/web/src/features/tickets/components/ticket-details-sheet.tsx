import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type SubmitEvent,
} from 'react'
import { useForm } from '@tanstack/react-form'

import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import { Textarea } from '@repo/ui/components/textarea'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@repo/ui/components/sheet'

import { DeleteTicketDialog } from './delete-ticket-dialog'

import { ticketStatuses } from '../ticket-statuses'
import type { TicketView, UpdateTicketInput } from '../types'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
})

type SheetOpenChangeHandler = NonNullable<
  ComponentProps<typeof Sheet>['onOpenChange']
>

type TicketDetailsSheetProps = {
  ticket: TicketView | null
  open: boolean
  isUpdating: boolean
  onOpenChange: (open: boolean) => void
  onOpenChangeComplete: (open: boolean) => void
  onSave: (id: string, input: UpdateTicketInput) => Promise<void>
  feedback?: ReactNode,
  onDelete: (id: string) => Promise<void>
}

const TicketDetailsSheet = ({
  ticket,
  open,
  isUpdating,
  onOpenChange,
  onOpenChangeComplete,
  onSave,
  feedback,
  onDelete,
}: TicketDetailsSheetProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const formId = useId()

  const [isEditing, setIsEditing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState<UpdateTicketInput>({
    title: '',
    description: '',
  })

  const form = useForm({
    defaultValues: initialValues,

    onSubmit: async ({ value, formApi }) => {
      if (!ticket) {
        throw new Error('Ce ticket n’est plus disponible.')
      }

      const input = {
        title: value.title.trim(),
        description: value.description.trim(),
      }

      await onSave(ticket.id, input)

      setInitialValues(input)
      formApi.reset(input)
      setIsEditing(false)
      titleRef.current?.focus()
    },
  })

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus()
    }
  }, [isEditing])

  const statusLabel =
    ticketStatuses.find((status) => status.value === ticket?.status)?.label ??
    'Statut inconnu'

  const handleStartEditing = () => {
    if (!ticket || isUpdating) return

    const values = {
      title: ticket.title,
      description: ticket.description,
    }

    setInitialValues(values)
    form.reset(values)
    setSubmitError(null)
    setIsEditing(true)
  }

  const handleCancelEditing = () => {
    if (form.state.isSubmitting) return

    form.reset(initialValues)
    setSubmitError(null)
    setIsEditing(false)
    titleRef.current?.focus()
  }

  const handleOpenChange: SheetOpenChangeHandler = (nextOpen, details) => {
    if (!nextOpen) {
      if (form.state.isSubmitting || isUpdating) {
        details.cancel()
        return
      }

      const values = form.state.values
      const hasChanges =
        values.title !== initialValues.title ||
        values.description !== initialValues.description

      if (isEditing && hasChanges) {
        details.cancel()
        setSubmitError(
          'Enregistre ou annule tes modifications avant de fermer.',
        )
        return
      }

      setIsEditing(false)
      setSubmitError(null)
    }

    onOpenChange(nextOpen)
  }

  const handleFormSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setSubmitError(null)

    try {
      await form.handleSubmit()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Impossible d’enregistrer les modifications.',
      )
    }
  }

  const getReturnFocus = () => {
    return (
      document.getElementById(`ticket-open-${ticket?.id}`) ??
      document.getElementById('tickets-heading')
    )
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      <form.Subscribe
        selector={(state) =>
          [
            state.canSubmit,
            state.isSubmitting,
            state.values.title !== initialValues.title ||
            state.values.description !== initialValues.description,
          ] as const
        }
      >
        {([canSubmit, isSubmitting, hasChanges]) => (
          <SheetContent
            side="right"
            showCloseButton={false}
            initialFocus={titleRef}
            finalFocus={getReturnFocus}
            className="flex w-full flex-col gap-0 p-0 data-[side=right]:w-full sm:max-w-lg"
          >
            <SheetHeader className="shrink-0 gap-2 border-b p-6">
              <SheetTitle
                ref={titleRef}
                tabIndex={-1}
                className="break-words text-xl leading-7 outline-none"
              >
                {ticket?.title ?? 'Ticket indisponible'}
              </SheetTitle>

              <SheetDescription>
                {isEditing
                  ? 'Modifie le titre et la description du ticket.'
                  : 'Informations et avancement du ticket.'}
              </SheetDescription>
            </SheetHeader>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
              {feedback}

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  {submitError}
                </p>
              )}

              {ticket ? (
                <>
                  <section className="space-y-2">
                    <h3 className="text-sm font-medium">Statut</h3>
                    <Badge variant="secondary">{statusLabel}</Badge>
                  </section>

                  {isEditing ? (
                    <form
                      id={formId}
                      noValidate
                      onSubmit={handleFormSubmit}
                      aria-busy={isSubmitting}
                    >
                      <fieldset disabled={isSubmitting} className="space-y-5">
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
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid

                            return (
                              <div className="space-y-2">
                                <Label htmlFor={`${formId}-title`}>Titre</Label>

                                <Input
                                  ref={titleInputRef}
                                  id={`${formId}-title`}
                                  name={field.name}
                                  required
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) =>
                                    field.handleChange(event.target.value)
                                  }
                                  aria-invalid={isInvalid}
                                  aria-describedby={
                                    isInvalid
                                      ? `${formId}-title-error`
                                      : undefined
                                  }
                                />

                                {isInvalid && (
                                  <p
                                    id={`${formId}-title-error`}
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
                              <Label htmlFor={`${formId}-description`}>
                                Description — facultative
                              </Label>

                              <Textarea
                                id={`${formId}-description`}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) =>
                                  field.handleChange(event.target.value)
                                }
                                rows={8}
                                className="resize-y"
                              />
                            </div>
                          )}
                        </form.Field>
                      </fieldset>
                    </form>
                  ) : (
                    <section className="space-y-2">
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                        {ticket.description || 'Aucune description.'}
                      </p>
                    </section>
                  )}

                  <dl className="grid gap-4 border-t pt-6 sm:grid-cols-2">
                    {[
                      { label: 'Créé le', date: ticket.createdAt },
                      { label: 'Modifié le', date: ticket.updatedAt },
                    ].map(({ label, date }) => (
                      <div key={label} className="space-y-1">
                        <dt className="text-xs text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="text-sm">
                          <time dateTime={date.toISOString()}>
                            {dateFormatter.format(date)}
                          </time>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ce ticket n’est plus disponible.
                </p>
              )}
            </div>

            <DeleteTicketDialog
              ticket={ticket}
              hidden={isEditing}
              disabled={isUpdating || isSubmitting}
              onDelete={onDelete}
              onDeleted={() => onOpenChange(false)}
            />

            <SheetFooter className="shrink-0 gap-2 border-t p-4">
              {isEditing ? (
                <>
                  <Button
                    type="submit"
                    form={formId}
                    disabled={
                      !canSubmit || !hasChanges || isSubmitting || isUpdating
                    }
                  >
                    {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={handleCancelEditing}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  {ticket && (
                    <Button
                      type="button"
                      disabled={isUpdating}
                      onClick={handleStartEditing}
                    >
                      Modifier
                    </Button>
                  )}

                  <SheetClose
                    render={<Button type="button" variant="outline" />}
                  >
                    Fermer
                  </SheetClose>
                </>
              )}
            </SheetFooter>
          </SheetContent>
        )}
      </form.Subscribe>
    </Sheet>
  )
}

export { TicketDetailsSheet }
