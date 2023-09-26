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
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  //get request can send data from server to the client
  //always specify the version of the api to prevent breaking someones code if you change the verion later on(can also do this in the subdomain)
  res.status(200).json({
    staus: 'success',
    results: tours.length, //just to help the user out the length of the array
    data: {
      tours: tours, //can write tours only as the key and value have same name
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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

  // res.send('Done'); //always need to send something to complete the request response cycle
  //but remember not to send two responses
});
//note that we have access access to the newly created tours after each time the server restarts which it luckily does each time we write and save to the tours-simple.JSON file

const port = 3000;
app.listen(port, () => {
  console.log('App running on server....');
});
