const fs = require('fs')
const host = `0.0.0.0`
const port = 8080

const cors_proxy = require(`cors-anywhere`)

cors_proxy.createServer({
    originWhitelist: [], 
    setHeaders: {
        'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Whale/1.5.73.16 Safari/537.36`,
    },
    requireHeader: [],
    removeHeaders: [`cookie`, `cookie2`],
    httpsOptions: {
        key: fs.readFileSync(`/root/private.key`),
        cert: fs.readFileSync(`/root/certificate.crt`),
    },
}).listen(port, host, function() {
    console.info(`Running cors`)
})
