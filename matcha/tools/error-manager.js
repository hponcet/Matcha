const tools = require('./tools-manager')

function send(type, message) {
  const date = tools.getDate()
  console.log(date + " [" + type.toUpperCase() + "] " + message)
}

module.exports = {
    handleError: function(res, reason, message, code) {
        let cause = ""

        if (message != null)
            cause = " " + message
        send("ERROR", reason + cause)
        if (res !== null)
            res.status(code || 500).json({"error": reason})
    },
    handleConsole: function (type, message) {
        send(type, message);
    }
}
