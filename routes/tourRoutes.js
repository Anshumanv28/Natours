const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const tourController = require('./../controllers/tourController');
// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID); //added an additional parameterised middleware to validate user id and removed the related code from tourController

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  // .get(catchAsync(tourController.getAllTours))  //could have also used catchAsync here instead of the in the controller (takes longer to debug sometimes)
  .get(authController.protect, tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour); //adding the middleware to the post middleware stack
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
