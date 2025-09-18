const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = 'Validation Error';
    error.details = Object.values(err.errors).map(val => val.message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = 'Duplicate field value entered';
    error.details = Object.keys(err.keyValue);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  // Supabase errors
  if (err.code && err.code.startsWith('PGRST')) {
    error.statusCode = 400;
    error.message = 'Database operation failed';
    if (process.env.NODE_ENV === 'development') {
      error.details = err.details;
    }
  }

  // Clerk errors
  if (err.clerkError) {
    error.statusCode = 400;
    error.message = 'Authentication service error';
    if (process.env.NODE_ENV === 'development') {
      error.details = err.errors;
    }
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && error.statusCode === 500) {
    error.message = 'Something went wrong';
    delete error.details;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(error.details && { details: error.details }),
    timestamp: error.timestamp,
    path: error.path,
    method: error.method
  });
};

module.exports = errorHandler;