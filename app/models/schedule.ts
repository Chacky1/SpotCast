import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Screen from '#models/screen'
import Content from '#models/content'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TimeCast } from '../casts/time.js'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare screenId: number

  @column()
  declare contentId: number

  @column({ consume: TimeCast.consume, prepare: TimeCast.prepare, serialize: TimeCast.serialize })
  declare startTime: DateTime

  @column({ consume: TimeCast.consume, prepare: TimeCast.prepare, serialize: TimeCast.serialize })
  declare endTime: DateTime

  @column()
  declare monday: boolean

  @column()
  declare tuesday: boolean

  @column()
  declare wednesday: boolean

  @column()
  declare thursday: boolean

  @column()
  declare friday: boolean

  @column()
  declare saturday: boolean

  @column()
  declare sunday: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Screen)
  declare screen: BelongsTo<typeof Screen>

  @belongsTo(() => Content)
  declare content: BelongsTo<typeof Content>
}
