const fs = require('fs')
const host = process.env.HOST || `0.0.0.0`
const port = process.env.PORT || 8080

const cors_proxy = require(`cors-anywhere`)

cors_proxy.createServer({
    originWhitelist: [], 
    requireHeader: [],
    removeHeaders: [`cookie`, `cookie2`],
    httpsOptions: {
        key: fs.readFileSync(`/root/private.key`),
        cert: fs.readFileSync(`/root/certificate.crt`),
    },
}).listen(port, host, function() {
    console.info(`Running cors`)
})
