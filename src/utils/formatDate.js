export default (millis) => {
  const d = new Date(millis)
  return d.toLocaleString('en', {
    year: 'numeric', month: 'numeric', day: 'numeric'
  })
}
