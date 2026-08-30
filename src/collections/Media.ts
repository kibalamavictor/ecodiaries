import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { editorOnly } from '@/lib/studio/editor-access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useRemoteStorage = Boolean(process.env.S3_BUCKET || process.env.BLOB_READ_WRITE_TOKEN)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  upload: useRemoteStorage
    ? true
    : {
        staticDir: path.resolve(dirname, '../../media'),
        mimeTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf'],
      },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
