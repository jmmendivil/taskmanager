import { useState } from 'react'
import getDiffs from '../utils/getDiffs'

// use with rAF
let requestId
export default function useChronometer () {
  const [status, setStatus] = useState('idle')
  // percent & label
  const [progress, setProgress] = useState([0, '00:00'])

  const getProgressPct = (duration, progress) => {
    const durationMillis = duration * 60 * 1000
    return (progress / durationMillis) * 100
  }

  const formatTimeText = (mins, secs) => {
    const secsFormat = '0' + secs
    const minsFormat = '0' + mins
    return minsFormat.substr(-2) + ':' + secsFormat.substr(-2)
  }

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
        const { diff, secs, mins } = getDiffs([startDate, +Date.now()], prevProgress)
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

  return { status, progress, startChronometer, stopChronometer }
}
