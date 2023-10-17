//this file will be used to handle everything not related to the express app, that is done in the app.js file
const dotenv = require('dotenv');
const app = require('./app'); // console.log(app.get('env')); //checking the environment variable set by express

dotenv.config({ path: './config.env' }); //using the config.env file to configure the envionment variables for our project insted of doing them one by one via the console
//need to read the environment variables before you require the app file or you can't read the environment variables inside the app file

//in case you want to do it via the console use command: NODE_ENV=development nodemon server.js
// console.log(process.env); //checking the environment variables set by node

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
