// 50 tareas aleatorias completadas
// consumiendo entre el 80% y el 100% de su duración
// distribuidas en la última semana

import jsf from 'json-schema-faker'
import faker from 'faker'
import schema from 'Models/task.schema' // 50 random tasks

jsf.extend('faker', () => faker)

export default async function randomData () {
  const sample = await jsf.resolve(schema)
  // mark progress between 80% and 100% of each duration
  return sample.map(s => {
    // convert created to millis (jsf returns string)
    const createdMillis = new Date(s.created).getTime()
    s.created = createdMillis
    // convert duration to millis and
    const durationMillis = s.duration * 1000
    // convert progress-pct (from jsf) to millis, based on duration
    s.progress = (durationMillis * s.progress) / 100
    // add latest update
    s.updates = [[(createdMillis + s.progress), 'DONE']]
    return s
  })
}
