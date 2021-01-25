const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const numToCurrency = (num) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

  return formatter.format(num).slice(1) // note: slice to remove appended "$"
}
module.exports = { capitalizeFirstLetter, numToCurrency }
