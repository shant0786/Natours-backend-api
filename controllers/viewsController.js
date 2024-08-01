const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res) => {
  //  1) get tour data from cllection
  const tours = await Tour.find();

  // 2) Build template
  // 3)Render that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) get the data , for the requested tour (including review and guides)

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'review',
    fields: 'review rating user'
  });
  //2) buid template

  // render template

  res.status(200).render('tour', {
    title: 'The Forest Hicker',
    tour
  });
});
