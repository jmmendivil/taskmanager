export default (mins, secs) => {
  const secsFormat = '0' + secs
  const minsFormat = '0' + mins
  return minsFormat.substr(-2) + ':' + secsFormat.substr(-2)
}
