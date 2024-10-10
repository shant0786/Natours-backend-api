const stripe = require('stripe')(process.env.STRIPE_SECTRET_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently bookied tour
  const tour = Tour.findById(req.params.tourId);
  // 2. create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name}Tour`,
        description: tour.summary,
        images: [`https://www.natour.travel/en/tour-item/hiking-tenerife/`],
        amoout: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  // 3. create session as response
  res.status(200).json({
    status: 'success',

    session
  });
});
