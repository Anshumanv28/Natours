//this file will be used to handle everything not related to the express app, that is done in the app.js file
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); //using the config.env file to configure the envionment variables for our project insted of doing them one by one via the console
//need to read the environment variables before you require the app file or you can't read the environment variables inside the app file

const app = require('./app'); // console.log(app.get('env')); //checking the environment variable set by express

//in case you want to do it via the console use command: NODE_ENV=development nodemon server.js
// console.log(process.env); //checking the environment variables set by node

const DB = process.env.DATABASE.replace(
  //replacing the connection strings <PASSWORD> with the original passowrd in the .env file
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  //for the local database
  .connect(process.env.DATABASE_LOCAL, {
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
  .then((con) => {
    // con is the connection object returned from the connection() promise
    // console.log(con.connections);
    console.log('DB connections successfull!');
  });

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
