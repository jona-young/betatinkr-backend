const DateFNS = require('date-fns')

function dateGetter(date) {
    return DateFNS.format(date, 'yyyy-MM-dd')
}

module.exports = { dateGetter }