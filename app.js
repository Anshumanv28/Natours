const express = require('express');
const fs = require('fs');

const app = express();

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
  //always specify the version of the api to prevent breaking someones code if you change the verion later on(can also do this in the subdomain)
  res.status(200).json({
    staus: 'success',
    results: tours.length, //just to help the user out the length of the array
    data: {
      tours: tours, //can write tours only as the key and value have same name
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('App running on server....');
});
