import vine from '@vinejs/vine'

export const storeContentValidator = vine.compile(
  vine.object({
    name: vine.string(),
    type: vine.enum(['video', 'youtube']),
    source: vine.string(),
  })
)

export const updateContentValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    type: vine.enum(['video', 'youtube']).optional(),
    source: vine.string().optional(),
  })
)
