class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //code query (queryObj or query)
    this.queryString = queryString; //original query string recived from the request (req.query)
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    // console.log('Filter OK');
    // console.log(this);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    // console.log('Sort OK');
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // query = query.select('name duration price'); //include these fields in the response, is called projecting
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //exclude these fields in the response
    }
    // console.log('Limit OK');
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    // console.log('paginate OK');
    return this;
  }
}

module.exports = APIFeatures;
