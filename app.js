const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
///GLOBAL * MIDDLEWARE *\\\

// Serving statics files
app.use(express.static(path.join(__dirname, 'public')));

// Secure http headers
app.use(helmet());
// Devlopment login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  Axios CDN link refused to load:Fix
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'unsafe-inline'],
      scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      // connectSrc: ["'self'", 'data', 'https://*.cloudflare.com'],
      connectSrc: ["'self'", 'http://127.0.0.1:3000']
    }
  })
);
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,Please try again in a hour!'
});
app.use('/api', limiter);
// Body parcer, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  console.log(req.cookies);
  next();
});
// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

///* START SERVER *\\\

module.exports = app;
