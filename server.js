//this file will be used to handle everything not related to the express app, that is done in the app.js file
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  //when an uncaught exception occurs, the process needs to be restarted as it is in an unclean state
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' }); //using the config.env file to configure the envionment variables for our project insted of doing them one by one via the console
//need to read the environment variables before you require the app file or you can't read the environment variables inside the app file

const app = require('./app'); // console.log(app.get('env')); //checking the environment variable set by express

//in case you want to do it via the console use command: NODE_ENV=development nodemon server.js
// console.log(process.env); //checking the environment variables set by node

// const DB = process.env.DATABASE.replace(
//   //replacing the connection strings <PASSWORD> with the original passowrd in the .env file
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

//for the local database
// const DB = process.env.DATABASE_LOCAL.replace(
const DB = process.env.DATABASE.replace(
  //replacing the connection strings <PASSWORD> with the original passowrd in the .env file
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true, //for handling depreciation warnings
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })

  //for the hosted database
  // .connect(DB, {
  //   useNewUrlParser: true, //for handling depreciation warnings?(learn more)
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  // })
  .then(() => console.log('DB connections successfull!'));
// con is the connection object returned from the connection() promise
// console.log(con.connections);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1); //1 means uncaught exception
  });
});
