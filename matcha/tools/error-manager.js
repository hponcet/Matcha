//-- handle errors --//
function send(type, message) {
    var d = new Date();
    var time = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    console.log(time + " " + type.toUpperCase() + ": " + message);
}

module.exports = {
    handleError: function(res, reason, message, code) {
        var cause = "";
        if (message != null)
            cause = " " + message;
        send("ERROR", reason + cause);
        if (res !== null)
            res.status(code || 500).json({"error": message});
    },
    handleConsole: function (type, message) {
        send(type, message);
    }
}
