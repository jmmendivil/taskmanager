export default ([start, end], prev) => {
  const diff = (end - start) + prev
  return {
    diff,
    secs: Math.floor((diff / 1000) % 60),
    mins: Math.floor((diff / 1000 / 60) % 60)
  }
}
