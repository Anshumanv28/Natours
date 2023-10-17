const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkID); //added an additional parameterised middleware to validate user id and removed the related code from tourController

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); //adding the middleware to the post middleware stack

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
