// const fs = require('fs');
const Tour = require('../models/tourModel'); //(usually we do ./../models/tourModel for getting out of two files then entering the models folder then the tourModel but it is not required here)
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Alias route for frequently use route
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};
//testing code before db integration

// const tours = JSON.parse(
//   //JSON file in array format
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

//testing code before db integration

//*****no longer needed JSON file operations after db integration******

// exports.checkID = (req, res, next, val) => {
//   if (val * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing price or name',
//     });
//   }
//   next();
// };

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); //chaining possible only because we return this from each function
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
//   try {
//     // 1A) Filtering
//     // const queryObj = { ...req.query };
//     // const excludeFields = ['page', 'sort', 'limit', 'fields'];
//     // excludeFields.forEach((el) => delete queryObj[el]);

//     // console.log(req.query);
//     // console.log(queryObj);

//     // const tours = await Tour.find({
//     //   duration: 5,
//     //   difficulty: 'easy',
//     // });

//     // const tours = await Tour.find(req.query);  //if we want to perform any operations on the query we can't so better await for the final mainpulated query

//     // const query = Tour.find(req.query);

//     // 1B) Advanced Filtering

//     // { difficulty: 'easy', duration: { $gte: 5} }  //expected
//     // { difficulty: 'easy', duration: { gte: '5' } }   //what we actually got from the query
//     //gte, gt, lte, lt    ding dong we can use REGEX, better brush it up

//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // console.log(JSON.parse(queryStr));

//     // let query = Tour.find(JSON.parse(queryStr)); //note the 'let' usage for keeping the query open for more operations

//     // 2) Sorting
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(',').join(' ');
//     //   query = query.sort(sortBy);
//     // } else {
//     //   query = query.sort('-createdAt');
//     // }

//     // 3) Field Limiting
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   // query = query.select('name duration price'); //include these fields in the response, is called projecting
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select('-__v'); //exclude these fields in the response
//     // }

//     // 4) Pagination
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const numTours = await Tour.countDocuments();
//     //   if (skip >= numTours) throw new Error('This page does not exist');
//     // }

//     //execute query finally
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate(); //chaining possible only because we return this from each function
//     const tours = await features.query;

//     // const tours = await Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');

//     // const tours = await Tour.find();
//     // console.log(tours);
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
//   //get request can send data from server to the client
//   //always specify the version of the api to prevent breaking someones code if you change the verion later on(can also do this in the subdomain)
//   // res.status(200).json({
//   //   staus: 'success',
//   //   requestedAt: req.requestTime,
//   // results: tours.length, //just to help the user out the length of the array
//   // data: {
//   //   tours: tours, //can write tours only as the key and value have same name
//   // },
//   // });
// };

exports.getTour = catchAsync(async (req, res, next) => {
  // const tour = await Tour.findById(req.params.id);
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt',
  // }); //will show populate the guides in the tours model(referencing) with the guides data during query execution
  // console.log('🍀🍀🍀🍀');
  // console.log(tour);
  if (!tour) {
    return next(new AppError('No tour found with this ID', 404));
  }
  //next auto assumes anything passed into it apart from the res ans req as an error and skips all the middlewares and goes directly to the error handling middleware
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
//   try {
//     const tour = await Tour.findById(req.params.id);
//     // Tour.findOne({ id: req.params.id });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }

//   //created a variable(id) in the url using : (:id/:var/:x fro multiple) these variables are called params
//   //added an optional parameter :x? using (?) needn't specify this in the request
//   // console.log(req.params); //to access the params

//   // const id = req.params.id * 1; //in JS we can convert a string(number in form of string) to integer by multiplying it by one(1)

//   // if (id > tours.length) {
//   //   return res.status(404).json({
//   //     //we used return cause we want to exit function immediately, again to avoid two responses
//   //     status: 'fail',
//   //     message: 'Invalid ID',
//   //   });
//   // }
//   //note you could have handled this error in another way too(think with your problem solving skills😉)

//   // const tour = tours.find((el) => el.id === id);
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tour,
//   //   },
//   // });
// };

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body); //creating a new tour directly on the model itself way

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
// try {
//   // const newTour = new Tour({})     //creating a new tour using a new document way
//   // newTour.save()                   //using the ducmunets save() to save the new tour

// const newTour = await Tour.create(req.body); //creating a new tour directly on the model itself way

// res.status(201).json({
//   status: 'success',
//   data: {
//     tour: newTour,
//   },
// });
// } catch (err) {
//   console.log(err);
//   res.status(400).json({
//     status: 'fail',
//     message: err,
//   });
// }

//post request can send data form client to server
//req object holds all the data about the request that was done by client side(even the data sent by the client)
//however express dosen't put the body data in req object so we have to use middleware here(see up .use(express.json()))
// console.log(req.body); //thx to middleware

// const newId = tours[tours.length - 1].id + 1; //be stateless(don't remember the previous id)
// const newTour = Object.assign({ id: newId }, req.body);

// tours.push(newTour);
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   },
// );
// });

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //always return the updated document rather than the original
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour, //again tour: tour => tour
    },
  });
});
//   // const id = req.params.id * 1;
//   // const tour = tours.find((el) => el.id === id);
//   // // if (!tour) {
//   // //   return res.status(404).json({
//   // //     status: 'fail',
//   // //     message: 'Invalid ID',
//   // //   });
//   // // }

//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, //always return the updated document rather than the original
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour, //again tour: tour => tour
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
// if (req.params.id * 1 > tours.length) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'Invalid ID',
//   });
// }
//   try {
//     await Tour.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //aggregate pipeline
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, //match stage (stages can be repeated)
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, //can also repeat stages
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
//   try {
//     const stats = await Tour.aggregate([
//       //aggregate pipeline
//       {
//         $match: { ratingsAverage: { $gte: 4.5 } }, //match stage (stages can be repeated)
//       },
//       {
//         $group: {
//           // _id: '$ratingsAverage',
//           _id: { $toUpper: '$difficulty' },
//           numTours: { $sum: 1 },
//           numRatings: { $sum: '$ratingsQuantity' },
//           avgRating: { $avg: '$ratingsAverage' },
//           avgPrice: { $avg: '$price' },
//           minPrice: { $min: '$price' },
//           maxPrice: { $max: '$price' },
//         },
//       },
//       {
//         $sort: { avgPrice: 1 },
//       },
//       // {
//       //   $match: { _id: { $ne: 'EASY' } }, //can also repeat stages
//       // },
//     ]);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params; //or can use   const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, //don't show id
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});
//   try {
//     const { year } = req.params; //or can use   const year = req.params.year * 1;

//     const plan = await Tour.aggregate([
//       {
//         $unwind: '$startDates',
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: '$startDates' },
//           numTourStarts: { $sum: 1 },
//           tours: { $push: '$name' },
//         },
//       },
//       {
//         $addFields: { month: '$_id' },
//       },
//       {
//         $project: {
//           _id: 0, //don't show id
//         },
//       },
//       {
//         $sort: { numTourStarts: -1 },
//       },
//       {
//         $limit: 12,
//       },
//     ]);

//     res.status(200).json({
//       status: 'success',
//       results: plan.length,
//       data: {
//         plan,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
