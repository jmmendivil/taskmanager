import { useMemo } from 'react'
import formatDate from 'Utils/formatDate'

export default function useGraphData (items) {
  return useMemo(() => {
    let exists = false
    // group data by date
    return items.reduce((acc, curr) => {
      exists = false
      // convert to timestamp because Victory
      const date = new Date(formatDate(curr.created)).getTime()
      // look for another 'date' in the accumulator
      // and update the total
      acc.forEach(d => {
        if (d.date === date) {
          exists = true
          d.total += 1
        }
      })
      if (!exists) acc.push({ date, total: 1 })
      return acc
    }, [])
  }, [items])
}
