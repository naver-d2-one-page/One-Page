const fs = require('fs')
<<<<<<< HEAD
const host = `0.0.0.0`
const port = 8080
=======
const host = process.env.HOST || `0.0.0.0`
const port = process.env.PORT || 8080
>>>>>>> dfca6dc68710be43c4e70856e25b82ceea6d7ca8

const cors_proxy = require(`cors-anywhere`)

cors_proxy.createServer({
    originWhitelist: [], 
<<<<<<< HEAD
    setHeaders: {
        'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Whale/1.5.73.16 Safari/537.36`,
    },
=======
>>>>>>> dfca6dc68710be43c4e70856e25b82ceea6d7ca8
    requireHeader: [],
    removeHeaders: [`cookie`, `cookie2`],
    httpsOptions: {
        key: fs.readFileSync(`/root/private.key`),
        cert: fs.readFileSync(`/root/certificate.crt`),
    },
}).listen(port, host, function() {
    console.info(`Running cors`)
})
