import { useState } from 'react'
import getDiffs from '../utils/getDiffs'

export default function useChronometer () {
  const [status, setStatus] = useState('stoped')
  // interval
  const [chronometer, setChronometer] = useState()
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
    setChronometer(
      setInterval(() => {
        const { diff, secs, mins } = getDiffs([startDate, +Date.now()], prevProgress)
        setProgress([
          getProgressPct(duration, diff),
          formatTimeText(mins, secs)
        ])
      }, 1000)
    )
    setStatus('started')
  }

  const stopChronometer = () => {
    clearInterval(chronometer)
    setStatus('stoped')
  }


  return { status, progress, startChronometer, stopChronometer }

}
