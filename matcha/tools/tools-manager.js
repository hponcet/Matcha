// btoa and atob functions for NodeJs server
exports.btoa = require("btoa");
exports.atob = require("atob");

// return a timestamp
exports.newTimestamp = function () {
  return Math.round(new Date().getTime() / 1000)
}

exports.getDate = () => {
  const d = new Date();
  let day = d.getDate()
  if (day.length === 1) {
    day = '0' + day
  }
  let month = (d.getMonth() + 1)
  if (month.length === 1) {
    month = '0' + month
  }
  let year = d.getFullYear()
  let hour = d.getHours()
  if (hour.length === 1) {
    hour = '0' + hour
  }
  let min = d.getMinutes()
  if (min.length === 1) {
    min = '0' + min
  }
  let sec = d.getSeconds()
  if (month.length === 1) {
    month = '0' + month
  }
  let date = day + '/' + month + '/' + year
  let fullHour = hour + ':' + min + ':' + sec

  function getHour () {
    return fullHour
  }

  function getDate () {
    return date
  }
  return date + ' ' + fullHour
}
