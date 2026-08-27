import type { Access, CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateStories } from '@/lib/revalidate'
import { lexicalToPlainText } from '@/lib/cms/mappers'

function buildSearchText(data: Record<string, unknown>): string {
  const parts = [data.title, data.excerpt, data.location]
  if (data.body) parts.push(lexicalToPlainText(data.body as never))
  if (Array.isArray(data.tags)) {
    parts.push(...data.tags.map((t: { tag?: string }) => t.tag).filter(Boolean))
  }
  return parts.filter(Boolean).join(' ')
}

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
    group: 'Content',
    description: 'Editorial queue: filter by status "In Review" for submitted contributor stories.',
  },
  access: {
    read: (({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'contributors') {
        return {
          or: [{ status: { equals: 'published' } }, { author: { equals: req.user.id } }],
        }
      }
      return { status: { equals: 'published' } }
    }) as Access,
    update: (({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'contributors') {
        return {
          and: [{ author: { equals: req.user.id } }, { status: { not_equals: 'published' } }],
        }
      }
      return false
    }) as Access,
    create: ({ req }) => req.user?.collection === 'users' || req.user?.collection === 'contributors',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'body', type: 'richText', editor: lexicalEditor() },
    { name: 'author', type: 'relationship', relationTo: 'contributors' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'readingTime', type: 'number', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'location', type: 'text' },
    { name: 'searchText', type: 'textarea', admin: { readOnly: true, hidden: true } },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
    { name: 'relatedStories', type: 'relationship', relationTo: 'stories', hasMany: true },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (data?.body) {
          const text = JSON.stringify(data.body)
          const words = text.split(/\s+/).length
          data.readingTime = Math.max(1, Math.ceil(words / 200))
        }
        if (data) data.searchText = buildSearchText(data as Record<string, unknown>)
        if (operation === 'create' && req.user?.collection === 'contributors' && !data?.author) {
          data.author = req.user.id
        }
        if (data?.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidateStories(doc.slug as string)
      },
    ],
  },
}
