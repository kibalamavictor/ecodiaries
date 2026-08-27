import type { Access } from 'payload'

/** Editors (Payload users) can manage content; public read stays open where needed. */
export const editorOnly: Access = ({ req }) => req.user?.collection === 'users'

export const publicReadEditorWrite = {
  read: () => true,
  create: editorOnly,
  update: editorOnly,
  delete: editorOnly,
} as const
