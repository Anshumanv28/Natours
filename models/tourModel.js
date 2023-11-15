const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [
      //required is a validator
      true,
      'A tour must have a name',
    ],
    unique: true,
    trim: true, //same ol trim() removes starting and trailing white spaces
  },
  duration: {
    type: Number,
    required: [
      true,
      'A tour must have a duration',
    ],
  },
  maxGroupSize: {
    type: Number,
    required: [
      true,
      'A tour must have a group size',
    ],
  },
  difficulty: {
    type: String,
    required: [
      true,
      'A tour must have a difficulty',
    ],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [
      true,
      'A tour must have a price',
    ],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [
      true,
      'A tour must have a description',
    ],
  },
  imageCover: {
    type: String,
    required: [
      true,
      'A tour must have a cover image',
    ],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

//testing code

// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     rating: 4.7,
//     price: 497,
//   });

//   testTour
//     .save()
//     .then((doc) => {
//       console.log(doc);
//     })
//     .catch((err) => {
//       console.log('ERROR!💥:', err);
//     });

//testing code

const Tour = mongoose.model(
  'Tour',
  tourSchema,
);

module.exports = Tour;
