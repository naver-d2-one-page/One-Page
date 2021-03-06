const createError = require(`http-errors`);
const express = require(`express`);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require(`morgan`);
const newlistRouter = require(`./controller/newlist`); // newlist 파일 임포트해서
const app = express();
const https = require('https');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger(`dev`));
app.use(`/`, newlistRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get(`env`) === `development` ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render(`error`);
});

// const port = 8888

// https.createServer({
// 	// key: fs.readFileSync('/etc/letsencrypt/live/mask-shop.kro.kr/privkey.pem'),
// 	// cert: fs.readFileSync('/etc/letsencrypt/live/mask-shop.kro.kr/cert.pem'),
// }, app).listen(port,host, () => {
// 	console.log('Express listening on port', port)
// })

app.listen(8080, `0.0.0.0`, () => {
	console.log(`server ON`)
})

module.exports = app;
