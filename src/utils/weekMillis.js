export const dayInMillis = 86400000
// get current day of the week in millis (start on monday)
export const weekDayMs = (new Date().getDay() * dayInMillis)
export const startOfWeekMs = (+Date.now() - weekDayMs)
export const endfOfWeekMs = (+Date.now() + ((dayInMillis * 7) - weekDayMs))
