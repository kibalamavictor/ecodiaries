'use client'

import {
  FormField,
  FormInput,
  FormLabel,
  FormTextarea,
} from '@/components/forms/eco-form'
import { categoryLabel } from '@/lib/contributors/application-helpers'
import type { ContributionDetails } from '@/lib/contributors/types'

type ContributorTypeFieldsProps = {
  detail: ContributionDetails
  index: number
  onChange: (index: number, next: ContributionDetails) => void
  errors: Record<string, string>
}

function fieldError(errors: Record<string, string>, index: number, field: string) {
  return errors[`details.${index}.${field}`] || errors[`details.${index}`]
}

export function ContributorTypeFields({ detail, index, onChange, errors }: ContributorTypeFieldsProps) {
  return (
    <details open className="group rounded-xl border border-border bg-white">
      <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-brand-forest marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="capitalize">{categoryLabel(detail.type)}</span>
        <span className="ml-2 text-xs font-normal text-muted-foreground">Tap to collapse</span>
      </summary>
      <div className="space-y-4 border-t border-border px-4 py-4">
        {detail.type === 'writer' ? (
          <>
            <StringListField
              label="Writing sample URLs"
              values={detail.writingSamples}
              placeholder="https://..."
              onChange={(writingSamples) => onChange(index, { ...detail, writingSamples })}
              error={fieldError(errors, index, 'writingSamples')}
            />
            <StringListField
              label="Preferred topics"
              values={detail.preferredTopics}
              placeholder="e.g. Agriculture"
              onChange={(preferredTopics) => onChange(index, { ...detail, preferredTopics })}
              error={fieldError(errors, index, 'preferredTopics')}
            />
          </>
        ) : null}

        {detail.type === 'photographer' ? (
          <>
            <FormField>
              <FormLabel>Portfolio URL</FormLabel>
              <FormInput
                type="url"
                value={detail.portfolioUrl}
                onChange={(e) => onChange(index, { ...detail, portfolioUrl: e.target.value })}
              />
              {fieldError(errors, index, 'portfolioUrl') ? (
                <p className="text-sm text-red-600">{fieldError(errors, index, 'portfolioUrl')}</p>
              ) : null}
            </FormField>
            <FormField>
              <FormLabel>Equipment (optional)</FormLabel>
              <FormInput
                value={detail.equipment || ''}
                onChange={(e) => onChange(index, { ...detail, equipment: e.target.value })}
              />
            </FormField>
          </>
        ) : null}

        {detail.type === 'filmmaker' ? (
          <>
            <FormField>
              <FormLabel>Showreel URL</FormLabel>
              <FormInput
                type="url"
                value={detail.showreelUrl}
                onChange={(e) => onChange(index, { ...detail, showreelUrl: e.target.value })}
              />
              {fieldError(errors, index, 'showreelUrl') ? (
                <p className="text-sm text-red-600">{fieldError(errors, index, 'showreelUrl')}</p>
              ) : null}
            </FormField>
            <FormField>
              <FormLabel>Past work (optional)</FormLabel>
              <FormTextarea
                rows={3}
                value={detail.pastWork || ''}
                onChange={(e) => onChange(index, { ...detail, pastWork: e.target.value })}
              />
            </FormField>
          </>
        ) : null}

        {detail.type === 'researcher' ? (
          <>
            <FormField>
              <FormLabel>Field of expertise</FormLabel>
              <FormInput
                value={detail.fieldOfExpertise}
                onChange={(e) => onChange(index, { ...detail, fieldOfExpertise: e.target.value })}
              />
              {fieldError(errors, index, 'fieldOfExpertise') ? (
                <p className="text-sm text-red-600">{fieldError(errors, index, 'fieldOfExpertise')}</p>
              ) : null}
            </FormField>
            <FormField>
              <FormLabel>Institution (optional)</FormLabel>
              <FormInput
                value={detail.institution || ''}
                onChange={(e) => onChange(index, { ...detail, institution: e.target.value })}
              />
            </FormField>
            <StringListField
              label="Publications (optional)"
              values={detail.publications?.length ? detail.publications : ['']}
              placeholder="Publication title or URL"
              onChange={(publications) =>
                onChange(index, {
                  ...detail,
                  publications: publications.filter(Boolean),
                })
              }
            />
          </>
        ) : null}

        {detail.type === 'poet' ? (
          <>
            <StringListField
              label="Poetry samples"
              values={detail.poetrySamples}
              placeholder="Paste a sample or link"
              multiline
              onChange={(poetrySamples) => onChange(index, { ...detail, poetrySamples })}
              error={fieldError(errors, index, 'poetrySamples')}
            />
            <FormField>
              <FormLabel>Themes (optional)</FormLabel>
              <FormInput
                value={detail.themes || ''}
                onChange={(e) => onChange(index, { ...detail, themes: e.target.value })}
              />
            </FormField>
          </>
        ) : null}

        {detail.type === 'other' ? (
          <FormField>
            <FormLabel>How would you like to contribute?</FormLabel>
            <FormTextarea
              rows={4}
              value={detail.description}
              onChange={(e) => onChange(index, { ...detail, description: e.target.value })}
            />
            {fieldError(errors, index, 'description') ? (
              <p className="text-sm text-red-600">{fieldError(errors, index, 'description')}</p>
            ) : null}
          </FormField>
        ) : null}
      </div>
    </details>
  )
}

function StringListField({
  label,
  values,
  placeholder,
  onChange,
  error,
  multiline,
}: {
  label: string
  values: string[]
  placeholder: string
  onChange: (values: string[]) => void
  error?: string
  multiline?: boolean
}) {
  function updateAt(i: number, val: string) {
    const next = [...values]
    next[i] = val
    onChange(next)
  }

  function addRow() {
    onChange([...values, ''])
  }

  function removeAt(i: number) {
    if (values.length <= 1) {
      onChange([''])
      return
    }
    onChange(values.filter((_, idx) => idx !== i))
  }

  return (
    <FormField>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-2">
        {values.map((val, i) => (
          <div key={i} className="flex gap-2">
            {multiline ? (
              <FormTextarea
                rows={2}
                value={val}
                placeholder={placeholder}
                onChange={(e) => updateAt(i, e.target.value)}
                className="flex-1"
              />
            ) : (
              <FormInput
                value={val}
                placeholder={placeholder}
                onChange={(e) => updateAt(i, e.target.value)}
                className="flex-1"
              />
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="shrink-0 rounded-lg border border-border px-2 text-xs text-muted-foreground"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-xs font-semibold text-brand-green underline"
        >
          + Add another
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </FormField>
  )
}
