module.exports = (err, req, res, next) => {
  //   console.log(err.stack); //StackTrace
  //   console.log(err);
  //   console.log(`STATUS CODE XXXXXXXXX:${err.statusCode}`);

  //Express knows this is an error handling middleware because it has 4 parameters
  err.statusCode = err.statusCode || 500; //if there is no status code then set it to 500(Interal server error)
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
