const fs = require('fs');

const tours = JSON.parse(
  //JSON file in array format
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

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

  if (id > tours.length) {
    return res.status(404).json({
      //we used return cause we want to exit function immediately, again to avoid two responses
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  //note you could have handled this error in another way too(think with your problem solving skills😉)

  const tour = tours.find(
    (el) => el.id === id
  );
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

  const newId =
    tours[tours.length - 1].id + 1; //be stateless(don't remember the previous id)
  const newTour = Object.assign(
    { id: newId },
    req.body
  ); //better to not mutate the original req.body object
  //cosnt newTour = Object.assign({req.body.id: newId})  //mutauive option to do the same
  //object.assign() will merge two/2 argument objects to form a new object

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
    }
  );
};
//note that we have access access to the newly created tours after each time the server restarts which it luckily does each time we write and save to the tours-simple.JSON file

exports.updateTour = (req, res) => {
  //can also use PUT but why do extra work? so we using PATCH

  const id = req.params.id * 1; //using the second way to handle error
  const tour = tours.find(
    (el) => el.id === id
  ); //find the elements with the same id as the params

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // var temp_tours = JSON.stringify(tours);
  // var temp_tour = tour;
  // var k1, k2;
  // const body = JSON.parse(JSON.stringify(req.body));
  // for (k1 in body) {
  //   for (k2 in tour) {                                //just trying to update
  //     if (k1 === k2) {                                //after almost 2hrs of trying I conclude it takes more work both computing and coding wise to patch by changing in between the JSON file
  //       tour[k1] = `${body[k2]}`;                     //better to just create a new object and delete the older one and then insert the new one
  //     }
  //   }
  // }
  // temp_tours.replace(temp_tour, JSON.stringify(tour));

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (
    req.params.id * 1 >
    tours.length
  ) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
