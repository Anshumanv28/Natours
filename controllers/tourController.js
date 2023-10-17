const fs = require('fs');

const tours = JSON.parse(
  //JSON file in array format
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  if (val * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing price or name',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  //GET all

  //get request can send data from server to the client
  //always specify the version of the api to prevent breaking someones code if you change the verion later on(can also do this in the subdomain)
  res.status(200).json({
    staus: 'success',
    requestedAt: req.requestTime,
    results: tours.length, //just to help the user out the length of the array
    data: {
      tours: tours, //can write tours only as the key and value have same name
    },
  });
};

exports.getTour = (req, res) => {
  //GET for specific tour

  //created a variable(id) in the url using : (:id/:var/:x fro multiple) these variables are called params
  //added an optional parameter :x? using (?) needn't specify this in the request
  console.log(req.params); //to access the params

  const id = req.params.id * 1; //in JS we can convert a string(number in form of string) to integer by multiplying it by one(1)

  // if (id > tours.length) {
  //   return res.status(404).json({
  //     //we used return cause we want to exit function immediately, again to avoid two responses
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  //note you could have handled this error in another way too(think with your problem solving skills😉)

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  //post request can send data form client to server
  //req object holds all the data about the request that was done by client side(even the data sent by the client)
  //however express dosen't put the body data in req object so we have to use middleware here(see up .use(express.json()))
  // console.log(req.body); //thx to middleware

  const newId = tours[tours.length - 1].id + 1; //be stateless(don't remember the previous id)
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // // if (!tour) {
  // //   return res.status(404).json({
  // //     status: 'fail',
  // //     message: 'Invalid ID',
  // //   });
  // // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
