const startOfWeek = new Date()
// monday is always 1 on getDay
// current day of the month - current day week day
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // add 1 to start on monday
startOfWeek.setHours(0, 0, 0, 0) // set to start of day
export const startOfWeekMs = startOfWeek.getTime() // millis

const endOfWeek = new Date()
// current day of the month + 7 days (week)
endOfWeek.setDate(startOfWeek.getDate() + 6) // add only 6 to end on sunday
endOfWeek.setHours(23, 59, 59, 0) // set to end of day
export const endfOfWeekMs = endOfWeek.getTime() // millis
