//all authorization and authentication is always defined in the route file
const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const tourController = require('./../controllers/tourController');
// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');
// eslint-disable-next-line import/no-useless-path-segments
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID); //added an additional parameterised middleware to validate user id and removed the related code from tourController

//confusing and duplicate code
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(
  authController.protect, //protect middleware will make sure only logged in users(authenticated user) can access the route
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan,
);

router
  .route('/')
  // .get(catchAsync(tourController.getAllTours))  //could have also used catchAsync here instead of the in the controller (takes longer to debug sometimes)
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour); //adding the middleware to the post middleware stack
  .post(
    authController.protect, //protect middleware will make sure only logged in users(authenticated user) can access the route
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// POST /tour/234fad4/reviews  examples of a nested route
// GET /tour/234fad4/reviews/948fjkdj

module.exports = router;
