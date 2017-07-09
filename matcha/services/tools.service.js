// btoa and atob functions for NodeJs server
const ObjectID = require('mongodb').ObjectID
exports.btoa = require('btoa')
exports.atob = require('atob')

// return a timestamp
exports.newTimestamp = function () {
  return Math.round(new Date().getTime() / 1000)
}

exports.validateObjectID = (id) => {
  const validate = ObjectID.isValid(id)
  if (validate) {
    return new ObjectID(id)
  } else {
    return false
  }
}

exports.secToTime = function (sec) {
  const secNum = parseInt(sec, 10) // don't forget the second param
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - (hours * 3600)) / 60)
  let seconds = secNum - (hours * 3600) - (minutes * 60)
  let day = ''

  if (hours > 23) {
    day = hours / 24 + 'd '
    hours = hours % 24
  }
  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  return day + hours + 'h ' + minutes + 'm ' + seconds + 's'
}

exports.getDate = (time) => {
  const d = new Date()
  let day = d.getDate()
  if (day.length === 1) {
    day = '0' + day
  }
  let month = (d.getMonth() + 1)
  let year = d.getFullYear()
  let hour = d.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }
  let min = d.getMinutes()
  if (min < 10) {
    min = '0' + min
  }
  let sec = d.getSeconds()
  if (month < 10) {
    month = '0' + month
  }
  let date = day + '/' + month + '/' + year
  let fullHour = hour + ':' + min + ':' + sec
  return date + ' ' + fullHour
}
