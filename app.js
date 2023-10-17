const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//----------------------
// 1) MIDDLEWARES
//----------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`)); //middleware to access satic files(note that the browser by default looks for the requested file in the public folder(that we defined) if not found)

app.use((req, res, next) => {
  console.log('Hello from the middleware😁');
  next(); //remember very very important to complete the request response cycle
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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

//define this after defining all the route handlers(good pracitce)
app.use('/api/v1/tours', tourRouter); //effectively created a mini app in itself
//note that this depends on the compiler/interpretter hitting this line of code then going to middleware function then to its respective route handler
app.use('/api/v1/users', userRouter); //this is called mounting the router(on the route)

//-----------------
// 4) START SERVER    tranfered to server.js
//------------------

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

module.exports = app;
