const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); //400 is bad request
};

const handleDuplicateFieldsDB = (err) => {
  // console.log('I AM WORKING');
  console.log(err);
  const value = err.keyValue.email; //this is a regular expression to extract the value from the error message
  console.log(value);
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400); //400 is bad request
};

const handleValidationErrorDB = (err) => {
  // console.log('I AM WORKING');
  const errors = Object.values(err.errors).map((el) => el.properties.message); //Object.values returns an array of the values of the object
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400); //400 is bad request
};

const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTexipiredError = (err) =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err, res) => {
  // console.log('I AM WORKING');
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack); //StackTrace
  //   console.log(err);
  // console.log(`STATUS CODE XXXXXXXXX:${err.statusCode}`);

  //Express knows this is an error handling middleware because it has 4 parameters
  err.statusCode = err.statusCode || 500; //if there is no status code then set it to 500(Interal server error)
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Tour validation failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTexipiredError();

    sendErrorProd(error, res);
  }
};
