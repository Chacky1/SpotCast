import vine from '@vinejs/vine'

export const storeScheduleValidator = vine.compile(
  vine.object({
    contentId: vine.number(),
    startTime: vine.string(),
    endTime: vine.string(),
    monday: vine.boolean().optional(),
    tuesday: vine.boolean().optional(),
    wednesday: vine.boolean().optional(),
    thursday: vine.boolean().optional(),
    friday: vine.boolean().optional(),
    saturday: vine.boolean().optional(),
    sunday: vine.boolean().optional(),
  })
)
