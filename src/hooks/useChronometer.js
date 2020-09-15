import { useState, useCallback } from 'react'
import getDiffsTime from 'Utils/getDiffsTime'
import getProgressPct from 'Utils/getProgressPct'
import formatTimeText from 'Utils/formatTimeText'

// use with rAF
let requestId
export default function useChronometer () {
  const [status, setStatus] = useState('idle')
  // percent & label
  const [progress, setProgress] = useState([0, '00:00'])

  const startChronometer = (duration, prevProgress, startDate) => {
    let start
    const timerStuff = timestamp => {
      // "remove" requestId to enable the loop
      requestId = undefined
      // execute every 1sec
      if (start === undefined) start = timestamp
      if (timestamp >= start + 1000) {
        start = timestamp
        // actual stuff
        const { diff, secs, mins } = getDiffsTime([startDate, +Date.now()], prevProgress)
        setProgress([
          getProgressPct(duration, diff),
          formatTimeText(mins, secs)
        ])
      }
      // loop it!
      startrAF()
    }
    const startrAF = () => {
      if (!requestId) {
        requestId = window.requestAnimationFrame(timerStuff)
      }
    }
    startrAF()
    setStatus('started')
  }

  const stopChronometer = useCallback(() => {
    if (requestId) {
      window.cancelAnimationFrame(requestId)
      requestId = undefined
    }
    setStatus('stoped')
  }, [])

  const resetChronometer = useCallback((duration, prevProgress) => {
    const { diff, secs, mins } = getDiffsTime([0, 0], prevProgress)
    setProgress([
      getProgressPct(duration, diff),
      formatTimeText(mins, secs)
    ])
  }, [])

  return { status, progress, startChronometer, stopChronometer, resetChronometer }
}
