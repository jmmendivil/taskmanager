import { DURATION } from 'Constants/task.const'
import { startOfWeekMs } from 'Utils/weekMillis'

const durations = Object.values(DURATION)
const localeOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
export default {
  type: 'array',
  maxItems: 50,
  minItems: 50,
  items: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        faker: 'lorem.text'
      },
      done: {
        type: 'boolean',
        enum: [true]
      },
      duration: {
        enum: durations
      },
      progress: {
        type: 'integer',
        minimum: 80,
        maximum: 100,
        minimumExclusive: true
      },
      created: {
        type: 'string',
        faker: {
          // between the start of the week and today (last week)
          'date.between': [
            new Date(startOfWeekMs).toLocaleString(localeOptions),
            new Date().toLocaleString(localeOptions)
          ]
        }
      }
    },
    required: [
      'title',
      'done',
      'duration',
      'progress',
      'created'
    ]
  }
}
