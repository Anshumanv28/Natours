const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//reference
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //uses closure to pass the Model to the function
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

//reference
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, //always return the updated document rather than the original
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour, //again tour: tour => tour
//     },
//   });
// });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //always return the updated document rather than the original
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc, //again tour: tour => tour
      },
    });
  });

//reference
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body); //creating a new tour directly on the model itself way

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body); //creating a new tour directly on the model itself way

    res.status(201).json({
      status: 'success',
      data: {
        doc, //doc: doc => doc
      },
    });
  });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // const tour = await Tour.findById(req.params.id);
//   const tour = await Tour.findById(req.params.id).populate('reviews'); //will show populate the reviews in the tours model(referencing) with the reviews data during query execution
//   // const tour = await Tour.findById(req.params.id).populate({
//   //   path: 'guides',
//   //   select: '-__v -passwordChangedAt',
//   // }); //will show populate the guides in the tours model(referencing) with the guides data during query execution
//   // console.log('🍀🍀🍀🍀');
//   // console.log(tour);
//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }
//   //next auto assumes anything passed into it apart from the res ans req as an error and skips all the middlewares and goes directly to the error handling middleware
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // const doc = await Model.findById(req.params.id).populate(popOptions); //will show populate the reviews in the tours model(referencing) with the reviews data during query execution
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate(); //chaining possible only because we return this from each function
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }; //filter will be empty if there is no tourId in the params i.e if no nested route is used

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); //chaining possible only because we return this from each function
    const docs = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
