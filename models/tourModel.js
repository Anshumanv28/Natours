const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        //required is a validator
        true,
        'A tour must have a name',
      ],
      unique: true, //unique is not a validator
      trim: true, //same ol trim() removes starting and trailing white spaces
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], //max and min length are validators
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], //we don't call the () we just tell to use it
      //using the external validator library
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        //enum works only for strings
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], //min and max are validators
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //need 'this'
          //this ONLY points to current doc on NEW document creation ONLY
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than regular price', //{VALUE} = val, specific to mongoose not JS
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON (GeoSpatial Data) - used to store data in the form of coordinates
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      //embedded documents
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, //embedding guides in tours
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', //referencing the User model(No import of user model needed)
      },
    ],
  },
  {
    toJSON: { virtuals: true }, //This setting ensures that when a Mongoose document is converted to JSON (e.g., when sending a response in an API), any virtual properties defined in the schema are included in the output. Virtual properties are not stored in the MongoDB database but are computed values based on other document fields.
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate
//making the reviews a virtual property to make it persistent in the database without actually storing it
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //how it is in the review model
  localField: '_id', //how it is in the tour model
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

tourSchema.virtual('durationWeeks').get(function () {
  //remember not to use arrow function as it doesn't have its own this keyword
  return this.duration / 7;
});

//Document Middleware:
tourSchema.pre('save', function (next) {
  //runs ONLY before the ./save() and .create() and not before .update()
  //pre middleware ()s are executed before the specified operations are executed
  this.slug = slugify(this.name, { lower: true });
  console.log(this); //the currently processed document\
  next();
});

//Embedding guides in tours
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//can have multiple pre and post middleware for each operation

// tourSchema.post('save', function (doc, next) {
//   //post middleware ()s are executed after the specified operation is executed
//   console.log(doc);
//   next();
// });

//Query Middleware
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  //handler() in tourController for this query is findOne(findById)
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //shift() is used to add elements to the end of the array and unshift() at the start of the array

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
