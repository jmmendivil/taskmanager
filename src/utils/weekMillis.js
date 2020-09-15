const DAY_IN_MILLIS = 86400000
// get current day of the week in millis (start on monday)
export const weekDayMs = (new Date().getDay() * DAY_IN_MILLIS)
export const startOfWeekMs = (+Date.now() - weekDayMs)
export const endfOfWeekMs = (+Date.now() + ((DAY_IN_MILLIS * 7) - weekDayMs))
