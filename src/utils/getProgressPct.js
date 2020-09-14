export default (duration, progress) => {
  const durationMillis = duration * 60 * 1000
  return (progress / durationMillis) * 100
}
