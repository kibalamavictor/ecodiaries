'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { z } from 'zod'

const leadSchema = z.object({
  projectId: z.string().optional(),
  organizationId: z.string().optional(),
  type: z.enum(['support', 'partner', 'intro', 'download']),
  name: z.string().min(2),
  email: z.string().email(),
  organizationName: z.string().optional(),
  message: z.string().optional(),
  consent: z.literal(true),
})

export type SubmitInterestLeadResult = { ok: true } | { ok: false; error: string }

export async function submitInterestLead(input: z.infer<typeof leadSchema>): Promise<SubmitInterestLeadResult> {
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || 'Invalid submission' }
  }

  const hdrs = await headers()
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  try {
    const payload = await getPayloadClient()
      await payload.create({
        collection: 'interest-leads',
        data: {
          type: parsed.data.type,
          name: parsed.data.name,
          email: parsed.data.email,
          organizationName: parsed.data.organizationName,
          message: parsed.data.message ? `${parsed.data.message}\n\n[ip:${ip}]` : `[ip:${ip}]`,
          consent: true,
          ...(parsed.data.projectId
            ? { project: Number(parsed.data.projectId) || parsed.data.projectId }
            : {}),
          ...(parsed.data.organizationId
            ? { organization: Number(parsed.data.organizationId) || parsed.data.organizationId }
            : {}),
        } as never,
      })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not save your interest' }
  }
}
