import { DateTime } from 'luxon'

export const TimeCast = {
  serialize(value: string | DateTime) {
    if (typeof value === 'string') return value

    return value.toFormat('HH:mm:ss')
  },

  prepare(value: DateTime) {
    return value
  },

  consume(value: string | DateTime) {
    if (typeof value === 'string') {
      return DateTime.fromFormat(value, 'HH:mm:ss')
    }

    return value
  },
}
