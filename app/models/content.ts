import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Schedule from '#models/schedule'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export type ContentType = 'video' | 'youtube'

export default class Content extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: ContentType

  @column()
  declare source: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Schedule)
  declare schedules: HasMany<typeof Schedule>
}
