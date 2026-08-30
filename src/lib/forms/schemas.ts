import { z } from 'zod'

export const contactReasons = [
  'A story tip',
  'Becoming a contributor',
  'A partnership',
  'Programmes & training',
  'Something else',
] as const

export type ContactReason = (typeof contactReasons)[number]

export const contactDetailsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
})

export const contactReasonSchema = z.object({
  reason: z.enum(contactReasons),
})

export const contactMessageSchema = z.object({
  message: z.string().min(20, 'Message should be at least 20 characters'),
  organization: z.string().optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export const programmeApplicationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  background: z.string().min(30, 'Tell us a bit about your background'),
  motivation: z.string().min(30, 'Share why you want to join this programme'),
  programme: z.string().min(1),
})

export const supportInterestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  organization: z.string().optional(),
  message: z.string().min(20, 'Message should be at least 20 characters'),
})
