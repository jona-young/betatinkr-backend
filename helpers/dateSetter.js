function dateSetter(date) {
    const dateToParse = new Date(date)
    const parsedDate = new Date(dateToParse.getTime() + Math.abs(dateToParse.getTimezoneOffset() * 60000))
    return parsedDate
}

module.exports = { dateSetter }