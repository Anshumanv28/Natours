const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../../models/tourModel');
// eslint-disable-next-line import/no-useless-path-segments
const User = require('./../../models/userModel');
// eslint-disable-next-line import/no-useless-path-segments
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' }); //using the config.env file to configure the envionment variables for our project insted of doing them one by one via the console

const DB = process.env.DATABASE.replace(
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
    // process.exit(); //aggressive way of killing a process use carefully
  });

//read Json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

//import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data successfully loaded!');
    process.exit(); //aggressive way of killing a process use carefully
  } catch (err) {
    console.log(err);
  }
};

//delete all the data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data successfully deleted!');
    process.exit(); //aggressive way of killing a process use carefully
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
