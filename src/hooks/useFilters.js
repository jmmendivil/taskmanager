import { useEffect, useState } from 'react'
import { startOfWeekMs } from 'Utils/weekMillis'

export default function useFilters (addFiltersToFn = () => {}) {
  const [filters, setFilters] = useState([undefined, false]) // [duration, weekOnly]
  useEffect(() => {
    const [duration, weekOnly] = filters
    const filtersToApply = [] // add filter functions here
    if (weekOnly) {
      filtersToApply.push(
        function weekFilter (t) { return t.created >= startOfWeekMs }
      )
    }
    if (typeof duration !== 'undefined') {
      filtersToApply.push(
        function durationFilter (t) { return t.duration === duration }
      )
    }
    addFiltersToFn(filtersToApply)
  }, [filters, addFiltersToFn])
  return [filters, setFilters]
}
