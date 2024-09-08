const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //merge the parameters from the parent router

//POST /tour/234fad4/reviews
//GET /tour/234fad4/reviews
//POST /reviews
//A nested POST endpoint

//only authenticated users can create, get, update and delete reviews
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );
module.exports = router;
