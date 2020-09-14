import { useState } from 'react'
import getDiffsTime from '../utils/getDiffsTime'
import getProgressPct from '../utils/getProgressPct'
import formatTimeText from '../utils/formatTimeText'

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

  const stopChronometer = () => {
    if (requestId) {
      window.cancelAnimationFrame(requestId)
      requestId = undefined
    }
    setStatus('stoped')
  }

  const resetChronometer = (duration, prevProgress) => {
    const { diff, secs, mins } = getDiffsTime([0, 0], prevProgress)
    setProgress([
      getProgressPct(duration, diff),
      formatTimeText(mins, secs)
    ])
  }

  return { status, progress, startChronometer, stopChronometer, resetChronometer }
}
