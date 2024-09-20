const path = require('path'); //core module used to manipulate paths
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//Experss supports pug, ejs, and more commonly used templating engines
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); //default is views folder
//pug templates are called views in express (MVC Model View Controller architecture)

//serving static files
// app.use(express.static(`${__dirname}/public`)); //middleware to access satic files(note that the browser by default looks for the requested file in the public folder(that we defined) if not found)
// use this instead of the above line good practice
app.use(express.static(path.join(__dirname, 'public'))); //path.join is used to join the current directory with the public folder

//----------------------
// 1) GLOBAL MIDDLEWARES
//----------------------

//set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit the number of requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middleware to parse the body of the request and limit the size of the body to 10kb

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// app.use((req, res, next) => {
//   console.log('Hello from the middleware😁');
//   next(); //remember very very important to complete the request response cycle
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// app.get('/', (req, res) => {   // the route handler function (req, res)
//   //app takes over the work of url parse method(which returns the query type and pathname)
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' }); //no need to specify to the browser that we are sending JSON express handles that
// });
// //so express took away the work of url parsing and header writing along with content type definition(compare to nodefarm )
// app.post('/', (req, res) => {
//   res.send('you can post to this endpoint...');
// });

//----------------------
// 1) ROUTES
//----------------------

app.get('/', (req, res) => {
  res.status(200).render('base');
});
//define this after defining all the route handlers(good pracitce)
app.use('/api/v1/tours', tourRouter); //effectively created a mini app in itself
//note that this depends on the compiler/interpretter hitting this line of code then going to middleware function then to its respective route handler
app.use('/api/v1/users', userRouter); //this is called mounting the router(on the route)

app.use('/api/v1/reviews', reviewRouter);
//this route will be used when no other route is matched
app.all('*', (req, res, next) => {
  //obselete error handling
  //req.get, req.post, req.patch all included in req.all()
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  //new error handling
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //if we pass anything in next() express will automatically assume that it is an error and skip all the other middlewares and go straight to the error handling middleware
});

//error handling middleware
// app.use((err, req, res, next) => {
//   console.log(err.stack); //StackTrace

//   //Express knows this is an error handling middleware because it has 4 parameters
//   err.stausCode = err.statusCode || 500; //if there is no status code then set it to 500(Interal server error)
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

//-----------------
// 4) START SERVER    tranfered to server.js
//------------------

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

module.exports = app;
