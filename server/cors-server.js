var host = process.env.HOST || `0.0.0.0`
var port = process.env.PORT || 8080

var cors_proxy = require(`cors-anywhere`)
cors_proxy.createServer({
    originWhitelist: [], 
    requireHeader: [],
    removeHeaders: [`cookie`, `cookie2`]
}).listen(port, host, function() {
    console.info(`Running cors`)
})
