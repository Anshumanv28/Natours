// res.send('Done'); //always need to send something to complete the request response cycle
//but remember not to send two responses

const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); //middleware

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

const tours = JSON.parse(
  //JSON file in array format
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  //GET all
  //get request can send data from server to the client
  //always specify the version of the api to prevent breaking someones code if you change the verion later on(can also do this in the subdomain)
  res.status(200).json({
    staus: 'success',
    results: tours.length, //just to help the user out the length of the array
    data: {
      tours: tours, //can write tours only as the key and value have same name
    },
  });
};

const getTour = (req, res) => {
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

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const postTour = (req, res) => {
  //post request can send data form client to server
  //req object holds all the data about the request that was done by client side(even the data sent by the client)
  //however express dosen't put the body data in req object so we have to use middleware here(see up .use(express.json()))
  // console.log(req.body); //thx to middleware

  const newId = tours[tours.length - 1].id + 1; //be stateless(don't remember the previous id)
  const newTour = Object.assign({ id: newId }, req.body); //better to not mutate the original req.body object
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

const patchTour = (req, res) => {
  //can also use PUT but why do extra work? so we using PATCH

  const id = req.params.id * 1; //using the second way to handle error
  const tour = tours.find((el) => el.id === id); //find the elements with the same id as the params

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

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id/:x?', getTour);
// app.post('/api/v1/tours', postTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//repetetive right?
//chained the methods using the same route for better structuring of the code(in case you need to change the url later on you can do it in one place HERE!)

app.route('/api/v1/tours').get(getAllTours).post(postTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .post(postTour)
  .patch(patchTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('App running on server....');
});
