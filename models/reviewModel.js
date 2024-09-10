const mongoose = require('mongoose');
const Tour = require('./tourModel'); //will be used to persist the average rating in the database

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      // required: [true, 'Review must have a rating'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true }, //makes sure that when a Mongoose document is converted to JSON, any virtual properties defined in the schema are included in the output
    toObject: { virtuals: true }, //like any calculated valuse based on other fields
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//static method
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    //"this" points to the model so we can call aggregate on the model
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, //number of ratings, for each review we add 1
        avgRating: { $avg: '$rating' }, //average rating, for each review we add the rating and find the new average
      },
    },
  ]);
  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

//this code will run in sequence as is the order of the code & we can't move the code to after the model is created because then the model will not have the calcAverageRatings method
reviewSchema.post('save', function (next) {
  //using "post" middleware because we want to run this after the document is saved
  //"this" points to the current review
  // this.calcAverageRatings(this.tour); //this will not work because this points to review and it is not created yet
  this.constructor.calcAverageRatings(this.tour); //this will work because the constructor is basically the model that created the document
  // next();  //post middleware does not have access to next()
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
